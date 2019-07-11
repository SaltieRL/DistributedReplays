import base64
import gzip
import logging
import os
import shutil
import traceback
from typing import Dict

import requests
from carball import analyze_replay_file
from requests import ReadTimeout

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.blueprints.spa_api.service_layers.replay.tag import apply_tags_to_game
from backend.blueprints.spa_api.service_layers.replay.visibility import apply_game_visibility
from backend.blueprints.spa_api.utils.query_param_definitions import upload_file_query_params
from backend.blueprints.spa_api.utils.query_params_handler import parse_query_params
from backend.database.utils.utils import add_objects
from backend.tasks import celery_tasks
from backend.tasks.utils import get_queue_length, get_default_parse_folder
from backend.utils.checks import log_error
from backend.utils.cloud_handler import upload_replay, upload_proto, upload_df, GCPManager

logger = logging.getLogger(__name__)


def create_replay_task(file, filename, uuid, task_ids, query_params: Dict[str, any] = None):
    if GCPManager.should_go_to_gcp(get_queue_length):
        encoded_file = base64.b64encode(file.read())
        try:
            r = requests.post(GCPManager.get_gcp_url(), data=encoded_file, timeout=0.5,
                              params={**{'uuid': uuid}, **query_params})
        except ReadTimeout as e:
            pass  # we don't care, it's given
        except Exception as e:
            # make sure we do not lose the replay file
            file.seek(0)
            file.save(filename)  # oops, error so lets save the file
            raise e
    else:
        file.save(filename)
        result = celery_tasks.add_replay_parse_task(os.path.abspath(filename), query_params)
        task_ids.append(result.id)


def parse_replay(self, filename, preserve_upload_date: bool = False,
                 # url parameters
                 query_params: Dict[str, any] = None,
                 # test parameters
                 custom_file_location: str = None, force_reparse: bool = False):
    """
    :param self:
    :param filename: filename
    :param query_params: The arguments from the url
    :param preserve_upload_date: If true the upload date is retained
    :param custom_file_location: If a custom file path should be used instead
    :param force_reparse: if true parsing will happen even if a file already exists.
    :return:
    """

    if custom_file_location is None:
        pickled = os.path.join(get_default_parse_folder(), os.path.basename(filename))
    else:
        pickled = os.path.join(custom_file_location, os.path.basename(filename))
    if custom_file_location is None:
        failed_dir = os.path.join(os.path.dirname(get_default_parse_folder()), 'failed')
    else:
        failed_dir = custom_file_location
    if os.path.isfile(pickled) and not force_reparse:
        return
    # try:
    try:
        analysis_manager = analyze_replay_file(filename)  # type: ReplayGame
    except Exception as e:
        if not os.path.isdir(failed_dir):
            os.makedirs(failed_dir)
        shutil.move(filename, os.path.join(failed_dir, os.path.basename(filename)))
        with open(os.path.join(failed_dir, os.path.basename(filename) + '.txt'), 'a') as f:
            f.write(str(e))
            f.write(traceback.format_exc())
        raise e
    try:
        if not os.path.isdir(os.path.dirname(pickled)):
            os.makedirs(os.path.dirname(pickled))
        with open(pickled + '.pts', 'wb') as fo:
            analysis_manager.write_proto_out_to_file(fo)
        with gzip.open(pickled + '.gzip', 'wb') as fo:
            analysis_manager.write_pandas_out_to_file(fo)
    except Exception as e:
        log_error(e, logger=logger)
        with open(os.path.join(failed_dir, os.path.basename(filename) + '.txt'), 'a') as f:
            f.write(str(e))
            f.write(traceback.format_exc())

    # success!
    proto_game = analysis_manager.protobuf_game

    if proto_game.game_metadata.match_guid is None or proto_game.game_metadata.match_guid == '':
        proto_game.game_metadata.match_guid = proto_game.game_metadata.id

    parsed_replay_processing(proto_game, query_params, preserve_upload_date=preserve_upload_date)

    return save_replay(proto_game, filename, pickled)


def save_replay(proto_game, filename, pickled):
    replay_id = proto_game.game_metadata.match_guid
    if replay_id == '':
        replay_id = proto_game.game_metadata.id

    replay_path = os.path.join(os.path.dirname(filename), replay_id + '.replay')
    proto_path = os.path.join(os.path.dirname(pickled), replay_id + '.replay.pts')
    pandas_path = os.path.join(os.path.dirname(pickled), replay_id + '.replay.gzip')
    shutil.move(filename, replay_path)
    shutil.move(pickled + '.pts', proto_path)
    shutil.move(pickled + '.gzip', pandas_path)

    result = upload_replay(replay_path)
    if result is not None:
        upload_proto(proto_path)
        upload_df(pandas_path)

        os.remove(replay_path)
        os.remove(proto_path)
        os.remove(pandas_path)

    return replay_id


def parsed_replay_processing(protobuf_game, query_params: Dict[str, any] = None, preserve_upload_date=True):
    logger.debug("Successfully parsed replay adding data to DB")
    # Process
    match_exists = add_objects(protobuf_game, preserve_upload_date=preserve_upload_date)

    logger.debug("SUCCESS: Added base data to db adding query params")

    if query_params is None:
        return

    query_params = parse_query_params(upload_file_query_params, query_params, add_secondary=True)
    if len(query_params) == 0:
        return

    try:
        game_id = protobuf_game.game_metadata.match_guid
        if game_id == "":
            game_id = protobuf_game.game_metadata.id
    except:
        game_id = None

    error_counter = []
    # Add game visibility option
    try:
        apply_game_visibility(query_params=query_params, game_id=game_id,
                              game_exists=match_exists)
    except CalculatedError as e:
        error_counter.append('visibility')
        log_error(e, message='Error changing visibility', logger=logger)

    # Add tags
    try:
        apply_tags_to_game(query_params=query_params, game_id=game_id)
    except CalculatedError as e:
        error_counter.append('tags')
        log_error(e, message='Error adding tags', logger=logger)

    if len(error_counter) == 0:
        logger.debug("SUCCESS: Processed all query params")
    else:
        logger.warning(
            'Found ' + str(len(error_counter)) + ' errors while processing query params: ' + str(error_counter))

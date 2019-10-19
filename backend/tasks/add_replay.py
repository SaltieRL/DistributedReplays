import logging
import os
import shutil
from typing import Dict

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.blueprints.spa_api.service_layers.replay.tag import apply_tags_to_game
from backend.blueprints.spa_api.service_layers.replay.visibility import apply_game_visibility
from backend.blueprints.spa_api.utils.query_param_definitions import upload_file_query_params
from backend.blueprints.spa_api.utils.query_params_handler import parse_query_params
from backend.database.utils.utils import add_objects

from backend.utils.file_manager import FileManager, PROTO_EXTENSION, PANDAS_EXTENSION
from backend.utils.logger import ErrorLogger
from backend.utils.cloud_handler import upload_replay, upload_proto, upload_df
from backend.utils.parsing_manager import parse_replay_wrapper

logger = logging.getLogger(__name__)


def parse_replay(self, replay_to_parse_path, preserve_upload_date: bool = False,
                 # url parameters
                 query_params: Dict[str, any] = None,
                 # test parameters
                 force_reparse: bool = False) -> str:
    """
    :param self:
    :param replay_to_parse_path: the path to the replay that is being parsed.
    :param query_params: The arguments from the url
    :param preserve_upload_date: If true the upload date is retained
    :param force_reparse: if true parsing will happen even if a file already exists.
    :return: The replay ID
    """

    parsed_data_path = os.path.join(FileManager.get_default_parse_folder(),
                                    os.path.basename(replay_to_parse_path))

    failed_dir = os.path.join(os.path.dirname(FileManager.get_default_parse_folder()), 'failed')

    # Todo preparse replay ID here to save on extra parsing and on locks.  (remember to delete locks older than 1 day)
    if os.path.isfile(parsed_data_path) and not force_reparse:
        return

    analysis_manager = parse_replay_wrapper(replay_to_parse_path, parsed_data_path, failed_dir,
                                            force_reparse, logger)

    if analysis_manager is None:
        return

    # success!
    proto_game = analysis_manager.protobuf_game

    if proto_game.game_metadata.match_guid is None or proto_game.game_metadata.match_guid == '':
        proto_game.game_metadata.match_guid = proto_game.game_metadata.id

    parsed_replay_processing(proto_game, query_params, preserve_upload_date=preserve_upload_date)

    return save_replay(proto_game, replay_to_parse_path, parsed_data_path, parsed_data_path)


def save_replay(proto_game, replay_to_parse_path, parsed_data_pandas_path, parsed_data_protos_path) -> str:
    """
    :param proto_game: Representing the parsed data.
    :param replay_to_parse_path: The file path to the replay we want to parse.
    :param parsed_data_pandas_path: The path to parsed pandas data with the initial unparsed filename.
    :param parsed_data_protos_path: The path to parsed proto data with the initial unparsed filename.
    :return: The replay ID.
    """
    replay_id = proto_game.game_metadata.match_guid
    if replay_id == '':
        replay_id = proto_game.game_metadata.id

    replay_path = FileManager.get_replay_path(replay_id)
    proto_path = FileManager.get_proto_path(replay_id)
    pandas_path = FileManager.get_pandas_path(replay_id)
    shutil.move(replay_to_parse_path, replay_path)
    shutil.move(parsed_data_protos_path + PROTO_EXTENSION, proto_path)
    shutil.move(parsed_data_pandas_path + PANDAS_EXTENSION, pandas_path)

    result = upload_replay(replay_path)
    if result is not None:
        upload_proto(proto_path)
        upload_df(pandas_path)

        os.remove(replay_path)
        os.remove(proto_path)
        os.remove(pandas_path)

    return replay_id


def parsed_replay_processing(protobuf_game, query_params: Dict[str, any] = None, preserve_upload_date=True) -> bool:
    logger.debug("Successfully parsed replay adding data to DB")
    # Process

    if query_params is None or len(query_params) == 0:
        match_exists = add_objects(protobuf_game, preserve_upload_date=preserve_upload_date)
        return match_exists

    query_params = parse_query_params(upload_file_query_params, query_params, add_secondary=True)
    if 'player_id' in query_params:
        protobuf_game.game_metadata.primary_player.id = query_params['player_id']

    match_exists = add_objects(protobuf_game, preserve_upload_date=preserve_upload_date)

    logger.debug("SUCCESS: Added base data to db adding query params")
    if query_params is None or len(query_params) == 0:
        return match_exists

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
                              game_exists=match_exists, proto_game=protobuf_game)
    except CalculatedError as e:
        error_counter.append('visibility')
        ErrorLogger.log_error(e, message='Error changing visibility', logger=logger)
    # Add game visibility option
    try:
        apply_tags_to_game(query_params=query_params, game_id=game_id)
    except CalculatedError as e:
        error_counter.append('tags')
        ErrorLogger.log_error(e, message='Error adding tags', logger=logger)

    if len(error_counter) == 0:
        logger.debug("SUCCESS: Processed all query params")
    else:
        logger.warning(
            'Found ' + str(len(error_counter)) + ' errors while processing query params: ' + str(error_counter))

    return match_exists

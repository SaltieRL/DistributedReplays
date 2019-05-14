import base64
import gzip
import os
import shutil
import traceback
from typing import Dict

import requests
from carball import analyze_replay_file
from requests import ReadTimeout

from backend.blueprints.spa_api.utils.query_params_handler import create_query_string
from backend.database.objects import Player, GameVisibility
from backend.database.utils.utils import convert_pickle_to_db, add_objs_to_db
from backend.tasks import celery_tasks
from backend.tasks.utils import get_queue_length, get_default_parse_folder

try:
    import config

    GCP_URL = config.GCP_URL
except:
    print('Not using GCP')
    GCP_URL = ''


def apply_game_visibility(query_params, sess, game_id):
    if query_params is None:
        return None
    if 'visibility' not in query_params:
        return None

    player_id = query_params['player_id']
    visibility = query_params['visibility']
    release_date = query_params['release_date']

    player = sess.query(Player).filter(Player.platformid == player_id).first()
    if player is not None:
        game_visibility_entry = GameVisibility(game=game_id, player=player_id, visibility=visibility)
        if release_date is not None:
            game_visibility_entry.release_date = release_date
        sess.add(game_visibility_entry)
        # GameVisibility fails silently - does not do anything if player_id does not exist.


def create_replay_task(filename, uuid, task_ids, query_params: Dict[str, any] = None):

    if should_go_to_gcp():
        with open(os.path.abspath(filename), 'rb') as f:
            encoded_file = base64.b64encode(f.read())
        try:
            gcp_call = GCP_URL + '&uuid=' + str(uuid)
            if query_params is not None:
                gcp_call += '&' + create_query_string(query_params)
            r = requests.post(gcp_call, data=encoded_file, timeout=0.5)
        except ReadTimeout as e:
            pass # we don't care, it's given
    else:
        result = celery_tasks.add_replay_parse_task(os.path.abspath(filename), query_params)
        task_ids.append(result.id)


def should_go_to_gcp():
    lengths = get_queue_length()  # priority 0,3,6,9
    return lengths[1] > 1000 and GCP_URL is not None


def parse_replay(self, filename, preserve_upload_date: bool = False,
                 # url parameters
                 query_params:Dict[str, any] = None,
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
        with open(os.path.join(failed_dir, os.path.basename(filename) + '.txt'), 'a') as f:
            f.write(str(e))
            f.write(traceback.format_exc())

    proto_game = analysis_manager.protobuf_game
    sess = self.session()
    game, player_games, players, teamstats = convert_pickle_to_db(proto_game)
    add_objs_to_db(game, player_games, players, teamstats, sess, preserve_upload_date=preserve_upload_date)

    # Add game visibility option
    apply_game_visibility(query_params, sess, game.hash)

    sess.commit()
    sess.close()

    replay_id = proto_game.game_metadata.match_guid
    if replay_id == '':
        replay_id = proto_game.game_metadata.id
    shutil.move(filename, os.path.join(os.path.dirname(filename), replay_id + '.replay'))
    shutil.move(pickled + '.pts', os.path.join(os.path.dirname(pickled), replay_id + '.replay.pts'))
    shutil.move(pickled + '.gzip', os.path.join(os.path.dirname(pickled), replay_id + '.replay.gzip'))
    return replay_id

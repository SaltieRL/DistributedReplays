import base64
import os
from typing import Dict

import requests
from requests import ReadTimeout

from backend.blueprints.spa_api.utils.query_params_handler import create_query_string
from backend.database.objects import Player, GameVisibility
from backend.tasks import celery_tasks
from backend.tasks.utils import get_queue_length

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

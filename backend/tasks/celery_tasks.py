# Celery workers
import base64
import gzip
import json
import os
import shutil
import traceback
from enum import Enum, auto
from typing import Dict

import flask
import requests
from carball import analyze_replay_file
from celery import Celery
from celery.result import AsyncResult
from celery.task import periodic_task
from backend.database.startup import lazy_get_redis

from backend.database.utils.utils import convert_pickle_to_db, add_objs_to_db
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.stats.player_stat_wrapper import PlayerStatWrapper
from backend.tasks import celeryconfig
from backend.tasks.add_replay import apply_game_visibility
from backend.tasks.middleware import DBTask
from backend.tasks.utils import get_default_parse_folder


celery = Celery()
celery.config_from_object(celeryconfig)

player_wrapper = PlayerWrapper(limit=10)
player_stat_wrapper = PlayerStatWrapper(player_wrapper)




@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(60 * 60 * 3, calc_global_stats.s(), name='calculate global stats every 3 hrs')
    sender.add_periodic_task(60 * 60 * 24, calc_global_dists.s(), name='calculate global dists every day')


def add_replay_parse_task(file_name, query_params: Dict[str, any] = None, **kwargs):
    return parse_replay_task.delay(*[file_name], **{**kwargs, **{'query_params': query_params}},)


@celery.task(base=DBTask, bind=True, priority=5)
def parse_replay_task(self, filename, preserve_upload_date: bool = False,
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
        failed_dir = os.path.join(os.path.dirname(os.path.dirname(pickled)), 'failed')
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


@celery.task(base=DBTask, bind=True, priority=9)
def parse_replay_task_low_priority(self, fn):
    parse_replay_task(filename=fn, preserve_upload_date=True)


@celery.task(base=DBTask, bind=True, priority=9)
def parse_replay_gcp(self, fn):
    with open(fn, 'rb') as f:
        encoded_file = base64.b64encode(f.read())
    r = requests.post(GCP_URL, data=encoded_file, timeout=0.5)


@periodic_task(run_every=30.0, base=DBTask, bind=True, priority=0)
def calc_global_stats(self):
    sess = self.session()
    result = player_stat_wrapper.get_global_stats(sess)
    sess.close()
    if lazy_get_redis() is not None:
        lazy_get_redis().set('global_stats', json.dumps(result))
        lazy_get_redis().set('global_stats_expire', json.dumps(True))
    print('Done')
    return result




@periodic_task(run_every=60 * 10, base=DBTask, bind=True, priority=0)
def calc_global_dists(self):


class ResultState(Enum):
    PENDING = auto()
    STARTED = auto()
    RETRY = auto()
    FAILURE = auto()
    SUCCESS = auto()


def get_task_state(id_) -> ResultState:
    # NB: State will be PENDING for unknown ids.
    return ResultState[AsyncResult(id_, app=celery).state]



if __name__ == '__main__':
    parse_replay_gcp('')
    # fn = '/home/matthew/PycharmProjects/Distributed-Replays/replays/88E7A7BE41717522C30040AA4B187E9E.replay'
    # output = fn + '.json'
    # pickled = os.path.join(os.path.dirname(__file__), 'parsed', os.path.basename(fn) + '.pkl')
    # # try:
    #
    # g = analyze_replay_file(fn, output)  # type: ReplayGame
    # game, player_games, players = convert_pickle_to_db(g)
    # pass

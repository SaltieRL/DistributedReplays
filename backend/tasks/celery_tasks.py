# Celery workers
import base64
import gzip
import json
import os
import shutil
import traceback
from enum import Enum, auto

import flask
import requests
from carball import analyze_replay_file
from celery import Celery
from celery.result import AsyncResult
from celery.task import periodic_task
from redis import Redis
from sqlalchemy import func, Numeric, cast

from backend.blueprints.spa_api.service_layers.global_stats import GlobalStatsMetadata, GlobalStatsGraph, \
    GlobalStatsGraphDataset
from backend.database.objects import Game, PlayerGame
from backend.database.utils.utils import convert_pickle_to_db, add_objs_to_db
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.stats.player_stat_wrapper import PlayerStatWrapper
from backend.tasks import celeryconfig
from backend.tasks.middleware import DBTask

try:
    import config

    GCP_URL = config.GCP_URL
except:
    print('Not using GCP')
    GCP_URL = ''
# from helpers import rewards

# bp = Blueprint('celery', __name__)


# def make_celery(app):
#     celery = Celery(app.import_name, backend=app.config['result_backend'],
#                     broker=app.config['CELERY_BROKER_URL'])
#     celery.conf.update(app.config)
#     TaskBase = celery.Task
#
#     class ContextTask(TaskBase):
#         abstract = True
#
#         def __call__(self, *args, **kwargs):
#             with app.app_context():
#                 return TaskBase.__call__(self, *args, **kwargs)
#
#     celery.Task = ContextTask
#     return celery

celery = Celery()
celery.config_from_object(celeryconfig)

player_wrapper = PlayerWrapper(limit=10)
player_stat_wrapper = PlayerStatWrapper(player_wrapper)

try:
    _redis = Redis(
        host='localhost',
        port=6379)
    _redis.get('test')  # Make Redis try to actually use the connection, to generate error if not connected.
except:  # TODO: Investigate and specify this except.
    _redis = None


def better_json_dumps(response: object):
    """
    Improvement on flask.jsonify (that depends on flask.jsonify) that calls the .__dict__ method on objects
    and also handles lists of such objects.
    :param response: The object/list of objects to be jsonified.
    :return: The return value of jsonify.
    """
    try:
        return flask.json.dumps(response)
    except TypeError:
        if isinstance(response, list):
            return flask.json.dumps([value.__dict__ for value in response])
        else:
            return flask.json.dumps(response.__dict__)


#
# @celery.task(bind=True)
# def calculate_reward(self, uid):
#     calc = rewards.RewardCalculator()
#     reward = calc.read_file(get_replay_path(uid))
#     session = Session()
#     r = session.query(Replay).filter(Replay.uuid == uid).first()
#     # TODO: Update replay reward in db
#     print(reward)

@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(60 * 60 * 3, calc_global_stats.s(), name='calculate global stats every 3 hrs')
    sender.add_periodic_task(60 * 60 * 24, calc_global_dists.s(), name='calculate global dists every day')


@celery.task(base=DBTask, bind=True, priority=5)
def parse_replay_task(self, fn, preserve_upload_date=False):
    output = fn + '.json'
    pickled = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'parsed', os.path.basename(fn))
    failed_dir = os.path.join(os.path.dirname(os.path.dirname(pickled)), 'failed')
    if os.path.isfile(pickled):
        return
    # try:
    try:
        analysis_manager = analyze_replay_file(fn)  # type: ReplayGame
    except Exception as e:
        if not os.path.isdir(failed_dir):
            os.makedirs(failed_dir)
        shutil.move(fn, os.path.join(failed_dir, os.path.basename(fn)))
        with open(os.path.join(failed_dir, os.path.basename(fn) + '.txt'), 'a') as f:
            f.write(str(e))
            f.write(traceback.format_exc())
        raise e

    with open(pickled + '.pts', 'wb') as fo:
        analysis_manager.write_proto_out_to_file(fo)
    with gzip.open(pickled + '.gzip', 'wb') as fo:
        analysis_manager.write_pandas_out_to_file(fo)

    g = analysis_manager.protobuf_game
    sess = self.session()
    game, player_games, players, teamstats = convert_pickle_to_db(g)
    add_objs_to_db(game, player_games, players, teamstats, sess, preserve_upload_date=preserve_upload_date)
    sess.commit()
    sess.close()

    replay_id = g.game_metadata.match_guid
    if replay_id == '':
        replay_id = g.game_metadata.id
    shutil.move(fn, os.path.join(os.path.dirname(fn), replay_id + '.replay'))
    shutil.move(pickled + '.pts', os.path.join(os.path.dirname(pickled), replay_id + '.replay.pts'))
    shutil.move(pickled + '.gzip', os.path.join(os.path.dirname(pickled), replay_id + '.replay.gzip'))


@celery.task(base=DBTask, bind=True, priority=9)
def parse_replay_task_low_priority(self, fn):
    parse_replay_task(fn, preserve_upload_date=True)


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
    if _redis is not None:
        _redis.set('global_stats', json.dumps(result))
        _redis.set('global_stats_expire', json.dumps(True))
    print('Done')
    return result


global_stats_metadatas = [
    GlobalStatsMetadata('Score', 'score'),
    GlobalStatsMetadata('Goals', 'goals'),
    GlobalStatsMetadata('Assists', 'assists'),
    GlobalStatsMetadata('Saves', 'saves'),
    GlobalStatsMetadata('Shots', 'shots'),
    GlobalStatsMetadata('Hits', 'total_hits'),
    GlobalStatsMetadata('Turnovers', 'turnovers'),
    GlobalStatsMetadata('Passes', 'total_passes'),
    GlobalStatsMetadata('Dribbles', 'total_dribbles'),
    GlobalStatsMetadata('Assists per Hit', 'assistsph'),
    GlobalStatsMetadata('Shots per Hit', 'shotsph'),
    GlobalStatsMetadata('Turnovers per Hit', 'turnoversph'),
    GlobalStatsMetadata('Saves per Hit', 'savesph'),
    GlobalStatsMetadata('Dribbles per Hit', 'total_dribblesph')
]


@periodic_task(run_every=60 * 10, base=DBTask, bind=True, priority=0)
def calc_global_dists(self):
    stats = ['score', 'goals', 'assists', 'saves', 'shots', 'total_hits', 'turnovers', 'total_passes', 'total_dribbles',
             'assistsph',
             'savesph', 'shotsph', 'turnoversph', 'total_dribblesph']

    session = self.session()
    overall_data = []
    numbers = []
    game_modes = range(1, 5)

    for game_mode in game_modes:
        numbers.append(
            session.query(func.count(PlayerGame.id)).join(Game).filter(Game.teamsize == (game_mode)).scalar())

    for global_stats_metadata in global_stats_metadatas:
        stats_field = global_stats_metadata.field
        per_hit_name_suffix = 'ph'
        if stats_field.endswith(per_hit_name_suffix):
            _query = session.query(
                func.round(
                    cast(getattr(PlayerGame, stats_field.replace(per_hit_name_suffix, '')),
                         Numeric) / PlayerGame.total_hits, 2).label('n'),
                func.count(PlayerGame.id)).filter(PlayerGame.total_hits > 0).group_by('n').order_by('n')
        else:
            _query = session.query(getattr(PlayerGame, stats_field), func.count(PlayerGame.id)).group_by(
                getattr(PlayerGame, stats_field)).order_by(getattr(PlayerGame, stats_field))

        datasets = []
        if stats_field == 'score':
            _query = _query.filter(PlayerGame.score % 10 == 0)
        for i, game_mode in enumerate(game_modes):
            # print(g)
            data_query = _query.join(Game).filter(Game.teamsize == game_mode).all()
            datasets.append({
                'name': f"{game_mode}'s",
                'keys': [],
                'values': []
            })
            for k, v in data_query:
                if k is not None:
                    datasets[-1]['keys'].append(float(k))
                    datasets[-1]['values'].append(float(v) / float(numbers[i]))
        overall_data.append(GlobalStatsGraph(
            name=global_stats_metadata.name,
            datasets=[GlobalStatsGraphDataset(**dataset) for dataset in datasets]
        ))
    session.close()
    if _redis is not None:
        _redis.set('global_distributions', better_json_dumps(overall_data))
    return overall_data


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

# Celery workers
import gzip
import json
import os

from carball import analyze_replay_file
from celery import Celery

from backend.database.objects import Game
from backend.database.utils.utils import convert_pickle_to_db, add_objs_to_db
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.stat_wrapper import PlayerStatWrapper
from backend.tasks import celeryconfig
from backend.tasks.middleware import DBTask

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
    sender.add_periodic_task(60 * 10.0, calc_global_stats.s(), name='calculate global stats every 10 min')


@celery.task(base=DBTask, bind=True, priority=5)
def parse_replay_task(self, fn):
    output = fn + '.json'
    pickled = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'parsed', os.path.basename(fn))
    if os.path.isfile(pickled):
        return
    # try:

    analysis_manager = analyze_replay_file(fn, output)  # type: ReplayGame
    with open(pickled + '.pts', 'wb') as fo:
        analysis_manager.write_proto_out_to_file(fo)
    with gzip.open(pickled + '.gzip', 'wb') as fo:
        analysis_manager.write_pandas_out_to_file(fo)
    g = analysis_manager.protobuf_game
    os.remove(output)
    # except Exception as e:
    #     print('Error: ', e)
    #     os.system('rm ' + output)
    #     os.system('mv {} {}'.format(fn, os.path.join(os.path.dirname(fn), 'broken', os.path.basename(fn))))
    #     return
    sess = self.session()
    old_hash = str(os.path.basename(fn)).split('.')[0]
    hash = g.game_metadata.id
    possible_duplicates = sess.query(Game).filter(Game.hash == hash).all()
    if len(possible_duplicates) > 0:
        for p in possible_duplicates:
            sess.delete(p)
    game, player_games, players = convert_pickle_to_db(g)
    add_objs_to_db(game, player_games, players, sess)
    sess.commit()
    sess.close()


@celery.task(base=DBTask, bind=True, priority=9)
def parse_replay_task_low_priority(self, fn):
    parse_replay_task(fn)


@celery.task(base=DBTask, bind=True, priority=0)
def calc_global_stats(self, redis=None):
    sess = self.session()
    result = player_stat_wrapper.get_global_stats(sess)
    sess.close()
    if redis is not None:
        redis.set('global_stats', json.dumps(result))
        redis.set('global_stats_expire', json.dumps(True), ex=60 * 10)
    return result


if __name__ == '__main__':
    fn = '/home/matthew/PycharmProjects/Distributed-Replays/replays/88E7A7BE41717522C30040AA4B187E9E.replay'
    output = fn + '.json'
    pickled = os.path.join(os.path.dirname(__file__), 'parsed', os.path.basename(fn) + '.pkl')
    # try:

    g = analyze_replay_file(fn, output)  # type: ReplayGame
    game, player_games, players = convert_pickle_to_db(g)
    pass

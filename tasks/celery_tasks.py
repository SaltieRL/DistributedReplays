# Celery workers
import gzip
import os
from celery import Celery
# from helpers import rewards
import sys

sys.path.append(os.path.abspath('replayanalysis/'))
from tasks import celeryconfig
from backend.functions import convert_pickle_to_db, add_objs_to_db
from backend.middleware import DBTask
from backend.database.objects import Game
from carball import analyze_replay_file

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


#
# @celery.task(bind=True)
# def calculate_reward(self, uid):
#     calc = rewards.RewardCalculator()
#     reward = calc.read_file(get_replay_path(uid))
#     session = Session()
#     r = session.query(Replay).filter(Replay.uuid == uid).first()
#     # TODO: Update replay reward in db
#     print(reward)


@celery.task(base=DBTask, bind=True, priority=5)
def parse_replay_task(self, fn):
    output = fn + '.json'
    pickled = os.path.join(os.path.dirname(__file__), '..', 'data', 'parsed', os.path.basename(fn))
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


if __name__ == '__main__':
    fn = '/home/matthew/PycharmProjects/Distributed-Replays/replays/88E7A7BE41717522C30040AA4B187E9E.replay'
    output = fn + '.json'
    pickled = os.path.join(os.path.dirname(__file__), 'parsed', os.path.basename(fn) + '.pkl')
    # try:

    g = analyze_replay_file(fn, output)  # type: ReplayGame
    game, player_games, players = convert_pickle_to_db(g)
    pass

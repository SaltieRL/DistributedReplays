# Celery workers
import os
import pickle
import sys
from celery import Celery
# from helpers import rewards
from flask import Blueprint, current_app

from functions import get_rank
from middleware import DBTask
from objects import Game

sys.path.append(os.path.join(os.path.dirname(__file__), 'replayanalysis'))
from replayanalysis.decompile_replays import decompile_replay
from replayanalysis.game.game import Game as ReplayGame
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


#
# @celery.task(bind=True)
# def calculate_reward(self, uid):
#     calc = rewards.RewardCalculator()
#     reward = calc.read_file(get_replay_path(uid))
#     session = Session()
#     r = session.query(Replay).filter(Replay.uuid == uid).first()
#     # TODO: Update replay reward in db
#     print(reward)


@celery.task(base=DBTask, bind=True)
def parse_replay_task(self, fn):
    output = fn + '.json'
    pickled = os.path.join(os.path.dirname(__file__), 'parsed', os.path.basename(fn) + '.pkl')
    if os.path.isfile(pickled):
        return
    # try:

    g = decompile_replay(fn, output)  # type: ReplayGame
    with open(pickled, 'wb') as f:
        pickle.dump(g, f)
    os.remove(output)
    # except Exception as e:
    #     print('Error: ', e)
    #     os.system('rm ' + output)
    #     os.system('mv {} {}'.format(fn, os.path.join(os.path.dirname(fn), 'broken', os.path.basename(fn))))
    #     return

    ranks = {p.online_id: get_rank(p.online_id) for p in g.players}
    if len(g.players) > 4:
        mode = 'standard'
    elif len(g.players) > 2:
        mode = 'doubles'
    else:
        mode = 'duel'
    rank_list = []
    mmr_list = []
    for k in ranks:
        keys = ranks[k].keys()
        if len(keys) > 0:
            latest = sorted(keys, reverse=True)[0]
            r = list(filter(lambda x: x['mode'] == mode, ranks[k][latest]))[0]
            if 'tier' in r:
                rank_list.append(r['tier'])
            if 'rank_points' in r:
                mmr_list.append(r['rank_points'])
    sess = self.session()
    old_hash = str(os.path.basename(fn)).split('.')[0]
    hash = g.replay_id
    possible_duplicates = sess.query(Game).filter(Game.hash == hash).all()
    if len(possible_duplicates) > 0:
        for p in possible_duplicates:
            sess.delete(p)
    game = Game(hash=hash, players=[str(p.online_id) for p in g.players],
                ranks=rank_list, mmrs=mmr_list, map=g.map)
    sess.add(game)
    sess.commit()

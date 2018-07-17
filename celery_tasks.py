# Celery workers
import os
import pickle

from celery import Celery

# from helpers import rewards
from RLBotServer import app
from functions import get_rank
from middleware import DBTask
from objects import Game
from replayanalysis.decompile_replays import decompile_replay


def make_celery(app):
    celery = Celery(app.import_name, backend=app.config['CELERY_RESULT_BACKEND'],
                    broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    TaskBase = celery.Task

    class ContextTask(TaskBase):
        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    celery.Task = ContextTask
    return celery


celery = make_celery(app)


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
    try:

        g = decompile_replay(fn, output)  # type: Game
        with open(pickled, 'wb') as f:
            pickle.dump(g, f)
        os.system('rm ' + output)
    except Exception as e:
        print('Error: ', e)
        os.system('rm ' + output)
        return

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
    game = Game(hash=str(os.path.basename(fn)).split('.')[0], players=[str(p.online_id) for p in g.players],
                ranks=rank_list, mmrs=mmr_list, map=g.map)
    sess.add(game)
    sess.commit()

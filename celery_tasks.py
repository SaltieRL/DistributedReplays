# Celery workers
import os
import pickle

# from helpers import rewards
from RLBotServer import Session, get_replay_path, app
from middleware import DBTask
from objects import Game, Replay
from replayanalysis.decompile_replays import decompile_replay
from celery import Celery


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
    g = decompile_replay(fn, output)  # type: Game
    with open(pickled, 'wb') as f:
        pickle.dump(g, f)
    os.system('rm ' + output)

    sess = self.session()
    game = Game(hash=str(os.path.basename(fn)).split('.')[0], players=[str(p.online_id) for p in g.players])
    sess.add(game)
    sess.commit()

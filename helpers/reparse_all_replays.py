import glob
import os
import datetime
from backend.database.objects import Game
from backend.database.startup import startup
from backend.tasks.celery_tasks import parse_replay_task_low_priority
import json


def main(s):
    sess = s()
    games = sess.query(Game.hash).all()
    with open(datetime.datetime.now().strftime('%H-%m-%s') + '.json', 'w') as f:
        json.dump(list(games), f)
    for game in games:
        path = os.path.abspath(os.path.join('..', 'data', 'rlreplays', game + '.replay'))
        parse_replay_task_low_priority.delay(path)
        print('Delayed ' + game)


if __name__ == '__main__':
    engine, Session = startup()
    main(Session)

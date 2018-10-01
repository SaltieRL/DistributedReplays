import base64
import os
import datetime

import requests

from backend.database.objects import Game
from backend.database.startup import startup
import json

try:
    import config

    GCP_URL = config.GCP_URL
except:
    print('Not using GCP')
    GCP_URL = ''


def main(s):
    sess = s()
    games = sess.query(Game.hash).all()
    with open(datetime.datetime.now().strftime('%H-%m-%s') + '.json', 'w') as f:
        json.dump(list(games), f)
    for game in games:
        path = os.path.abspath(os.path.join('..', 'data', 'rlreplays', game + '.replay'))

        with open(path, 'rb') as f:
            encoded_file = base64.b64encode(f.read())
        r = requests.post(GCP_URL, data=encoded_file, timeout=0.5)
        print('Delayed ' + game)


if __name__ == '__main__':
    engine, Session = startup()
    main(Session)

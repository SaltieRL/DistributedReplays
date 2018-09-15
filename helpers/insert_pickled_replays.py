import glob
import logging
import os
import pickle
import traceback
from concurrent.futures import ThreadPoolExecutor
from functools import partial

import redis
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker, Session

from backend.database.objects import Game
from backend.database.startup import startup
from backend.database.utils.utils import convert_pickle_to_db, add_objs_to_db

logger = logging.getLogger(__name__)
engine, Session = startup()  # type: (Engine, sessionmaker)

r = redis.Redis(
    host='localhost',
    port=6379)
pickled_location = os.path.join(os.path.dirname(__file__), '..', 'data', 'parsed')
pickles = glob.glob(os.path.join(pickled_location, '*.pkl'))

s = Session()
games = s.query(Game.hash).all()


def main():
    with ThreadPoolExecutor() as executor:
        fn = partial(parse_pickle)
        executor.map(fn, pickles, timeout=120)


def parse_pickle(p):
    s = Session()  # type: Session
    with open(p, 'rb') as f:
        try:
            g = pickle.load(f)  # type: ReplayGame
            if g.api_game.id in games:
                print('skipping', g.api_game.id)
                return
        except EOFError:
            print ('what error')
            return
        try:
            game, player_games, players = convert_pickle_to_db(g, offline_redis=r)
            add_objs_to_db(game, player_games, players, s)
        except Exception as e:
            print(e)
            traceback.print_exc()
    s.commit()


if __name__ == '__main__':
    main()

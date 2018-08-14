import glob
import logging
import os
import pickle
import sys
from concurrent.futures import ThreadPoolExecutor
from functools import partial

import redis
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker, Session

lib_location = os.path.join(os.path.dirname(__file__), '..', 'replayanalysis')
sys.path.append(lib_location)
loc = os.path.join(os.path.dirname(__file__), '..')
sys.path.append(loc)

from objects import Game, Player, PlayerGame
from startup import startup
from functions import convert_pickle_to_db, add_objs_to_db

from replayanalysis.analysis.saltie_game.saltie_game import SaltieGame as ReplayGame

logger = logging.getLogger(__name__)
engine, Session = startup()  # type: (Engine, sessionmaker)

r = redis.Redis(
    host='localhost',
    port=6379)
pickled_location = os.path.join(os.path.dirname(__file__), '..', 'parsed')
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
        print ('adding ', game.hash)

        print('adding {}'.format(game.hash))
    s.commit()


if __name__ == '__main__':
    main()

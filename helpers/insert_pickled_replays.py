import glob
import logging
import os
import pickle
import traceback
from concurrent.futures import ThreadPoolExecutor
from functools import partial

from sqlalchemy.orm import sessionmaker, Session

from backend.database.objects import Game
from backend.database.startup import lazy_startup, lazy_get_redis
from backend.database.utils.utils import convert_pickle_to_db, add_objs_to_db

logger = logging.getLogger(__name__)
session = lazy_startup()  # type: sessionmaker

r = lazy_get_redis()
pickled_location = os.path.join(os.path.dirname(__file__), '..', 'data', 'parsed')
pickles = glob.glob(os.path.join(pickled_location, '*.pkl'))

s = session()
games = s.query(Game.hash).all()


def main():
    with ThreadPoolExecutor() as executor:
        fn = partial(parse_pickle)
        executor.map(fn, pickles, timeout=120)


def parse_pickle(p):
    s = session()  # type: Session
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
            game, player_games, players, teamstats = convert_pickle_to_db(g, offline_redis=r)
            add_objs_to_db(game, player_games, players, teamstats, s)
        except Exception as e:
            print(e)
            traceback.print_exc()
    s.commit()


if __name__ == '__main__':
    main()

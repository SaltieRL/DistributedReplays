import glob
import os
import pickle
import sys

import redis
import sqlalchemy
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker, Session

lib_location = os.path.join(os.path.dirname(__file__), '..', 'replayanalysis')
sys.path.append(lib_location)
loc = os.path.join(os.path.dirname(__file__), '..')
sys.path.append(loc)

from objects import Game, Player
from startup import startup
from functions import convert_pickle_to_db

from replayanalysis.game.game import Game as ReplayGame

engine, Session = startup()  # type: (Engine, sessionmaker)

r = redis.Redis(
    host='localhost',
    port=6379)
pickled_location = os.path.join(os.path.dirname(__file__), '..', 'parsed')
pickles = glob.glob(os.path.join(pickled_location, '*.pkl'))
s = Session()  # type: Session
for p in pickles:
    with open(p, 'rb') as f:
        try:
            g = pickle.load(f)  # type: ReplayGame
        except EOFError:
            continue
        try:
            match = s.query(Game).filter(Game.hash == g.replay_id).first()
            if match is not None:
                s.delete(match)
                print('deleting {}'.format(match.hash))
        except TypeError as e:
            print (e)
            print("error", g.replay_id)
            pass
        game, player_games, players = convert_pickle_to_db(g, offline_redis=r)
        s.add(game)
        for pl in players:  # type: Player
            try:
                match = s.query(Player).filter(Player.platformid == str(pl.platformid)).first()
            except TypeError:

                print("error", g.replay_id)
                print(pl.platformid)
                match = None
            if not match:
                s.add(pl)
        for pg in player_games:
            s.add(pg)
        print('adding {}'.format(game.hash))
    s.flush()
s.commit()

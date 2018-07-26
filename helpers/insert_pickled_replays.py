import glob
import os
import pickle
import sys

from objects import Game
from startup import startup
from functions import convert_pickle_to_db

from replayanalysis.game.game import Game as ReplayGame
engine, Session = startup()
lib_location = os.path.join(os.path.dirname(__file__), '..', 'replayanalysis')
sys.path.append(lib_location)

pickled_location = os.path.join(os.path.basename(__file__), '..', 'parsed')
pickles = glob.glob(os.path.join(pickled_location, '*.pkl'))
s = Session()
for p in pickles:
    with open(p, 'rb') as f:
        g = pickle.load(f)  # type: ReplayGame
        match = s.query(Game).filter_by(Game.hash == g.replay_id).first()
        if match is not None:
            s.delete(match)
            print ('deleting {}'.format(match.hash))
        game = convert_pickle_to_db(g)
        s.add(game)
        print('adding {}'.format(game.hash))
s.commit()

import glob
import os

from backend.database.objects import Game
from backend.database.startup import startup


def clean_database(sess, ignored_parsed=False):
    s = sess()
    # delete games that don't exist in parsed form
    pkls = [os.path.basename(p).split('.')[0] for p in glob.glob('parsed/*.pkl')]
    print(pkls)
    games = s.query(Game).all()
    for game in games:
        if ignored_parsed or game.hash not in pkls:
            print('delete', game.hash)
            s.delete(game)
    s.commit()
    # delete duplicates
    current_hashes = []
    games = s.query(Game)[::-1]
    for game in games:
        if game.hash not in current_hashes:
            current_hashes.append(game.hash)
        else:
            s.delete(game)
    s.commit()


if __name__ == '__main__':
    engine, Session = startup()
    clean_database(Session)

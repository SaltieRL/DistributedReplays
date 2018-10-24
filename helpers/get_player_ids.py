import json
import os

import sys

from sqlalchemy import func

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.database.objects import PlayerGame
from backend.database.startup import startup


def main(sess):
    session = sess()
    with open('helpers/ids.json') as f:
        players = json.load(f)
    mapping = {}
    for player in players:
        game: PlayerGame = session.query(PlayerGame).filter(
            func.lower(PlayerGame.name).like("%{}%".format(player.lower()))).first()
        if game is not None:
            id_ = game.player
            mapping[player] = id_
    print(mapping)


if __name__ == '__main__':
    engine, Session = startup()
    main(Session)

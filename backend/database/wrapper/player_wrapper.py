import logging
import random
from typing import List

from sqlalchemy import func, cast, String
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

from backend.database.objects import Player, PlayerGame, Game

logger = logging.getLogger(__name__)


def create_default_player():
    player = Player()
    player.platformid = 3678
    player.platformname = 'test user'
    if bool(random.getrandbits(1)):
        player.avatar = "https://media.istockphoto.com/photos/golden-retriever-puppy-looking-up-isolated-on-black-backround-picture-id466614709?k=6&m=466614709&s=612x612&w=0&h=AVW-4RuYXFPXxLBMHiqoAKnvLrMGT9g62SduH2eNHxA="
    else:
        player.avatar = "https://cdn3-www.dogtime.com/assets/uploads/2014/12/file_19035_square_100_rainy-day-activity-dog-playing-with-food-toy.jpg"

    return player


def get_random_player(session):
    try:
        player = session.query(Player).one()
    except MultipleResultsFound as e:
        logger.warning(e)
        player = session.query(Player).order_by(func.random()).limit(1).first()
    except NoResultFound as e:
        logger.warning(e)
        player = create_default_player()
    return player


class PlayerWrapper:
    def __init__(self, limit=20):
        self.limit = limit

    def get_player_games(self, session, id_):
        if isinstance(id_, list):
            return session.query(PlayerGame).join(Game).filter(
                Game.players.contains(cast(id_, postgresql.ARRAY(String)))).filter(
                PlayerGame.player == id_[0])
        else:
            return session.query(PlayerGame).filter(PlayerGame.player == id_).filter(
                PlayerGame.game is not None)

    def get_player_games_paginated(self, session, id_, page=0):
        query = self.get_player_games(session, id_)
        return self.get_paginated_match_history(query, page=page, id_list=isinstance(id_, list))

    def get_paginated_match_history(self, existing_query, page=0,
                                    id_list=False) -> List[PlayerGame]:
        if not id_list:
            existing_query = existing_query.join(Game)
        return existing_query.order_by(Game.match_date)[
               page * self.limit: (page + 1) * self.limit]

    def get_total_games(self, session, id_):
        return self.get_player_games(session, id_).count()

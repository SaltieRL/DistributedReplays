import logging
import random
from typing import List

from sqlalchemy import func, cast, String, desc
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

from backend.database.objects import Player, PlayerGame, Game

logger = logging.getLogger(__name__)


def create_default_player():
    player = Player()
    player.platformid = "3678"
    player.platformname = 'test user with a really long name but even longer'
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
    def __init__(self, limit=None):
        self.limit = limit

    def get_player_games(self, session, id_, replay_ids=None):
        query = session.query(PlayerGame)
        if replay_ids is not None:
            query = query.filter(PlayerGame.game.in_(replay_ids))
        if isinstance(id_, list):
            return query.join(Game).filter(
                Game.players.contains(cast(id_, postgresql.ARRAY(String)))).filter(
                PlayerGame.player == id_[0])
        else:
            return query.filter(PlayerGame.player == id_).filter(
                PlayerGame.game != None)

    def get_player_games_paginated(self, session, id_, page: int = 0, limit: int = None):
        query = self.get_player_games(session, id_)
        return self.get_paginated_match_history(query, page=page, id_list=isinstance(id_, list), limit=limit)

    def get_paginated_match_history(self, existing_query, page: int,
                                    id_list: bool, limit: int) -> List[PlayerGame]:
        if not id_list:
            existing_query = existing_query.join(Game)
        limit = limit if limit is not None else self.limit

        return existing_query.order_by(desc(Game.match_date))[page * limit: (page + 1) * limit]

    def get_total_games(self, session, id_, replay_ids=None):
        """
        Get total number of games this player has.

        :param session: DBSession
        :param id_: ID to get
        :param replay_ids: Replay IDs to filter by
        :return: Integer
        """
        return self.get_player_games(session, id_, replay_ids=replay_ids).count()

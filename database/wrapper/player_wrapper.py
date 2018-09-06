import logging
from typing import List

from sqlalchemy import func, cast, String
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

from database.objects import Player, PlayerGame, Game

logger = logging.getLogger(__name__)


def create_default_player():
    player = Player()
    player.platformid = 3678
    player.platformname = 'test user'
    player.avatar = "https://i.ytimg.com/vi/rziIg5V1RdA/maxresdefault.jpg"

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

    def get_player_games(self, session, id):
        if isinstance(id, list):
            # query = session.query(Game.hash).filter(cast(Game.players, postgresql.ARRAY(String)).contains([id1, id2]))
            # query = session.query(Game.hash).filter(Game.players.op('@>')('{\'%s\', \'%s\'}' % (id1, id2)))
            return session.query(PlayerGame).join(Game).filter(
                Game.players.contains(cast(id, postgresql.ARRAY(String)))).filter(
                PlayerGame.player == id[0])
        else:
            return session.query(PlayerGame).filter(PlayerGame.player == id).filter(
                PlayerGame.game is not None)

    def get_player_games_paginated(self, session, id, page=0):
        query = self.get_player_games(session, id)

        return self.get_paginated_match_history(query, page=page, id_list=isinstance(id, list))

    def get_paginated_match_history(self, existing_query, page=0, id_list=False) -> List[PlayerGame]:
        if not id_list:
            existing_query = existing_query.join(Game)
        return existing_query.order_by(Game.match_date)[page * self.limit: (page + 1) * self.limit]

    def get_total_games(self, session, id):
        return self.get_player_games(session, id).count()

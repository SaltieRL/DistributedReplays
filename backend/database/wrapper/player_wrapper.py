import logging
import random
from typing import List

from flask import g
from sqlalchemy import func, cast, String, desc, or_
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

from backend.blueprints.spa_api.errors.errors import ReplayNotFound
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Player, PlayerGame, Game, GameVisibilitySetting, GameVisibility

logger = logging.getLogger(__name__)


@with_session
def create_default_player(session=None):
    player = session.query(Player).first()

    player.platformid = "LOCAL_PLATFORMID" if player is None else player.platformid
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
        # logger.warning(e)
        player = session.query(Player).order_by(func.random()).first()
    except NoResultFound as e:
        # logger.warning(e)
        player = create_default_player(session=session)
    return player


class PlayerWrapper:
    def __init__(self, limit=None):
        self.limit = limit

    def get_player_games(self, session, id_, replay_ids=None, filter_private=True):
        query = session.query(PlayerGame).join(Game)
        if replay_ids is not None:
            query = query.filter(PlayerGame.game.in_(replay_ids))

        if isinstance(id_, list):
            query = query.filter(Game.players.contains(cast(id_, postgresql.ARRAY(String)))).filter(
                PlayerGame.player == id_[0])
        else:
            query = query.filter(PlayerGame.player == id_).filter(
                PlayerGame.game != None)

        if filter_private:
            if g.user is not None:
                if not g.admin:
                    query = query.filter(or_(Game.visibility != GameVisibilitySetting.PRIVATE,
                                             Game.players.any(g.user.platformid)))
            else:
                query = query.filter(Game.visibility != GameVisibilitySetting.PRIVATE)

        return query

    def get_player_games_paginated(self, session, id_, page: int = 0, limit: int = None, filter_private=True):
        query = self.get_player_games(session, id_, filter_private=filter_private)
        return self.get_paginated_match_history(query, page=page, limit=limit)

    def get_paginated_match_history(self, existing_query, page: int, limit: int) -> List[PlayerGame]:
        limit = limit if limit is not None else self.limit
        return existing_query.order_by(desc(Game.match_date))[page * limit: (page + 1) * limit]

    def get_total_games(self, session, id_, replay_ids=None, filter_private=False):
        """
        Get total number of games this player has.

        :param session: DBSession
        :param id_: ID to get
        :param replay_ids: Replay IDs to filter by
        :param filter_private:
        :return: Integer
        """
        return self.get_player_games(session, id_, replay_ids=replay_ids, filter_private=filter_private).count()

    @staticmethod
    @with_session
    def change_game_visibility(game_hash: str, visibility: GameVisibilitySetting, session=None) -> GameVisibilitySetting:
        # g.user.platformid = "76561198065217357"
        entry = session.query(GameVisibility).filter(GameVisibility.player == g.user.platformid,
                                                     GameVisibility.game == game_hash).first()
        if entry is None:
            # Check if user has right to change visibility:
            game = session.query(Game).filter(Game.hash == game_hash, Game.players.any(g.user.platformid)).first()
            if game is not None:
                entry = GameVisibility(player=g.user.platformid, game=game_hash, visibility=visibility)
                session.add(entry)
            else:
                # Replay might actually exist, but user should not know.
                raise ReplayNotFound()
        else:
            entry.visibility = visibility
        session.commit()

        updated_visibility_setting = PlayerWrapper.update_game_visibility(game_hash, session)
        return updated_visibility_setting

    @staticmethod
    def update_game_visibility(game_hash, session) -> GameVisibilitySetting:
        game = session.query(Game).filter(Game.hash == game_hash).first()

        lowest_visibility_setting = session.query(
            func.min(GameVisibility.visibility)).filter(GameVisibility.game == game_hash).scalar()
        if lowest_visibility_setting is not None:
            game.visibility = lowest_visibility_setting
            session.commit()
        else:
            # Nothing updated - setting remains default
            lowest_visibility_setting = GameVisibilitySetting.DEFAULT
        return lowest_visibility_setting

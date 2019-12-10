import logging
import random
from typing import List

from sqlalchemy import func, cast, String, desc, or_
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

from backend.blueprints.spa_api.errors.errors import ReplayNotFound
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Player, PlayerGame, Game, GameVisibilitySetting, GameVisibility
from backend.database.wrapper.query_filter_builder import QueryFilterBuilder
from backend.utils.checks import is_admin
from backend.utils.safe_flask_globals import get_current_user_id, UserManager

logger = logging.getLogger(__name__)


@with_session
def create_default_player(session=None):
    player = session.query(Player).first()

    if player is None:
        player = Player()

    player.platformid = "LOCAL_PLATFORMID" if player.platformid is None else player.platformid
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
        query = session.query(PlayerGame).join(Game, Game.hash == PlayerGame.game)
        if replay_ids is not None:
            query = query.filter(PlayerGame.game.in_(replay_ids))

        if isinstance(id_, list):
            query = query.filter(Game.players.contains(cast(id_, postgresql.ARRAY(String)))).filter(
                PlayerGame.player == id_[0])
        else:
            query = query.filter(PlayerGame.player == id_).filter(
                PlayerGame.game != None)

        if filter_private:
            if UserManager.get_current_user() is not None:
                if not is_admin():
                    query = query.filter(or_(Game.visibility != GameVisibilitySetting.PRIVATE,
                                             Game.players.any(get_current_user_id())))
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
    def have_permission_to_change_game(game_hash: str, user_id, session=None) -> bool:
        entry = session.query(GameVisibility).filter(GameVisibility.player == user_id,
                                                     GameVisibility.game == game_hash).first()
        if entry is None:
            # Check if user has right to change visibility:
            builder = QueryFilterBuilder().as_game().set_replay_id(game_hash).with_players([user_id])
            if builder.build_query(session).first() is not None:
                return True
            else:
                # Replay might actually exist, but user should not know.
                raise ReplayNotFound()
        else:
            return True

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

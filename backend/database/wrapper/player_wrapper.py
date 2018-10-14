import logging
import random
from typing import List

from sqlalchemy import func, cast, String, desc, or_
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.database.objects import Player, PlayerGame, Game, GameVisibilitySetting, GameVisibility

from flask import g, current_app

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
        return self.get_player_games(session, id_, replay_ids=replay_ids, filter_private=filter_private).count()

    @staticmethod
    def change_game_visibility(platformid, game_hash, visibility: GameVisibilitySetting):
        session = current_app.config['db']()
        entry = session.query(GameVisibility).filter(GameVisibility.player == platformid,
                                                     GameVisibility.game == game_hash).first()
        # TODO maybe check if replay and player exist
        # dbms will do it anyway but it might be better to raise a more specific exception
        if entry is None:
                entry = GameVisibility(player=platformid, game=game_hash, visibility=visibility)
                session.add(entry)
        else:
            entry.visibility = visibility
        session.commit()
        result = PlayerWrapper.update_game_visibility(game_hash, session)
        session.close()
        return result

    @staticmethod
    def update_game_visibility(game_hash, session):
        visibility_setting = GameVisibilitySetting.DEFAULT
        game = session.query(Game).filter(Game.hash == game_hash).first()
        if game is None:
            raise CalculatedError(404, "Replay not found")  # very unlikely that this will ever happen

        settings = session.query(GameVisibility).filter(GameVisibility.game == game_hash).all()

        for setting in settings:
            if setting.visibility is GameVisibilitySetting.PRIVATE:
                visibility_setting = GameVisibilitySetting.PRIVATE
            elif setting.visibility is GameVisibilitySetting.PUBLIC:
                visibility_setting = GameVisibilitySetting.PUBLIC

        game.visibility = visibility_setting
        session.commit()
        return visibility_setting

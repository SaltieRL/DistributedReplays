from typing import List

from sqlalchemy import desc

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Game, GameTag, Tag as DBTag
from backend.database.wrapper.query_filter_builder import QueryFilterBuilder
from .replay import Replay
from ..player.player_profile_stats import player_wrapper


class MatchHistory:
    def __init__(self, total_count: int, replays: List[Replay]):
        self.totalCount = total_count
        self.replays = [replay.__dict__ for replay in replays]

    @staticmethod
    @with_session
    def create_from_id(id_: str, page: int, limit: int, session=None) -> 'MatchHistory':
        games = [player_game.game_object
                 for player_game in player_wrapper.get_player_games_paginated(session, id_, page, limit)]
        total_count = player_wrapper.get_total_games(session, id_, filter_private=True)
        match_history = MatchHistory(total_count, [Replay.create_from_game(game) for game in games])
        return match_history

    @staticmethod
    @with_session
    def create_with_filters(page: int, limit: int, session=None, **kwargs) -> 'MatchHistory':
        # TODO: move this somewhere else and make it reusable
        if limit > 100:
            limit = 100
        builder = QueryFilterBuilder().as_game().with_stat_query([Game])
        QueryFilterBuilder.apply_arguments_to_query(builder, kwargs)
        query = builder.build_query(session)

        if 'min_length' in kwargs:
            query = query.filter(Game.length > kwargs['min_length'])
        if 'max_length' in kwargs:
            query = query.filter(Game.length < kwargs['max_length'])
        if 'map' in kwargs:
            query = query.filter(Game.map == kwargs['map'])
        count = query.count()
        games = query.order_by(desc(Game.match_date))[page * limit: (page + 1) * limit]
        matches = MatchHistory(count, [Replay.create_from_game(game) for game in games])
        return matches

    @staticmethod
    @with_session
    def get_replays_with_tag(user_id: str, tag_name: str, session=None):
        print(user_id, tag_name)
        tag = session.query(DBTag).filter(DBTag.owner == user_id).filter(DBTag.name == tag_name).one_or_none()
        if tag is None:
            raise CalculatedError(404, "Tag does not exist")
        print(tag)
        gametags = session.query(GameTag.game_id).filter(GameTag.tag_id == tag.id).all()
        game_ids = [game[0] for game in gametags]
        print(game_ids)
        games = session.query(Game).filter(Game.hash.in_(game_ids)).all()
        return MatchHistory(len(games), [Replay.create_from_game(game) for game in games])

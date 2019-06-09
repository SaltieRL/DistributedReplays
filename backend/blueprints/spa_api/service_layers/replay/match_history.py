from typing import List

from flask import current_app
from sqlalchemy import desc

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Game
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

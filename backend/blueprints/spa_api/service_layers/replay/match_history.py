from typing import List

from flask import current_app

from .replay import Replay
from ..player.player_profile_stats import player_wrapper


class MatchHistory:
    def __init__(self, total_count: int, replays: List[Replay]):
        self.totalCount = total_count
        self.replays = [replay.__dict__ for replay in replays]

    @staticmethod
    def create_from_id(id_: str, page: int, limit: int) -> 'MatchHistory':
        session = current_app.config['db']()
        games = [player_game.game_object
                 for player_game in player_wrapper.get_player_games_paginated(session, id_, page, limit)]
        total_count = player_wrapper.get_total_games(session, id_)
        match_history = MatchHistory(total_count, [Replay.create_from_game(game) for game in games])
        session.close()
        return match_history

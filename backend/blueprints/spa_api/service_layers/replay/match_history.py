from typing import List

from flask import current_app

from .replay import Replay
from ..player.player_profile_stats import player_wrapper


class MatchHistory:
    def __init__(self, replays: List[Replay]):
        self.replays = [replay.__dict__ for replay in replays]

    @staticmethod
    def create_from_id(id_: str) -> 'MatchHistory':
        session = current_app.config['db']()
        games = [player_game.game_object for player_game in player_wrapper.get_player_games_paginated(session, id_)]
        return MatchHistory([Replay.create_from_game(game) for game in games])

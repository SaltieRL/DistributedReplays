from functools import wraps
from typing import List

from flask import current_app

from backend.database.objects import PlayerGame


def with_session(decorated_function):
    @wraps(decorated_function)
    def func(*args, **kwargs):
        if 'session' in kwargs:
            if kwargs['session'] is not None:
                return decorated_function(*args, **kwargs)
        session = current_app.config['db']()
        try:
            kwargs['session'] = session
            result = decorated_function(*args, **kwargs)
        finally:
            session.close()
        return result
    return func


def sort_player_games_by_team_then_id(player_games: List[PlayerGame]) -> List[PlayerGame]:
    def get_id(player_game: PlayerGame):
        return player_game.id

    def get_is_orange(player_game: PlayerGame):
        return player_game.is_orange

    return sorted(sorted(player_games, key=get_id), key=get_is_orange)

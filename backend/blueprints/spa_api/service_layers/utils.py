from functools import wraps
from typing import List, Dict

from carball.generated.api.game_pb2 import Game
from carball.generated.api.player_pb2 import Player

from backend.database.objects import PlayerGame
from backend.database.startup import get_current_session


def with_session(decorated_function):
    @wraps(decorated_function)
    def func(*args, **kwargs):
        if 'session' in kwargs and kwargs['session'] is not None:
            return decorated_function(*args, **kwargs)
        session = get_current_session()
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


def create_player_map(proto_game: Game) -> Dict[str, Player]:
    # create player metadata
    player_map = dict()
    for player_proto in proto_game.players:
        player_map[str(player_proto.id.id)] = player_proto
    return player_map


def get_protobuf_player_name_by_id(player_id: str, protobuf_game: Game) -> Player:
    for player in protobuf_game.players:
        if player.id.id == player_id:
            return player

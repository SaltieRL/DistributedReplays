from typing import List

from backend.database.objects import PlayerGame


def sort_player_games_by_team_then_id(player_games: List[PlayerGame]) -> List[PlayerGame]:
    def get_id(player_game: PlayerGame):
        return player_game.id

    def get_is_orange(player_game: PlayerGame):
        return player_game.is_orange

    return sorted(sorted(player_games, key=get_id), key=get_is_orange)

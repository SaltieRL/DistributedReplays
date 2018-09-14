from typing import List, cast

from backend.database.objects import Game, PlayerGame


class ReplayPlayer:
    def __init__(self, id_: str, name: str, is_orange: bool,
                 score: int, goals: int, assists: int, saves: int, shots: int):
        self.id = id_
        self.name = name
        self.isOrange = is_orange
        self.score = score
        self.goals = goals
        self.assists = assists
        self.saves = saves
        self.shots = shots

    @staticmethod
    def create_from_game(game: Game) -> List['ReplayPlayer']:
        return [
            ReplayPlayer(
                id_=player.player,
                name=player.name,
                is_orange=player.is_orange,
                score=player.score,
                goals=player.goals,
                assists=player.assists,
                saves=player.saves,
                shots=player.shots
            )
            for player in cast(List[PlayerGame], game.playergames)
        ]

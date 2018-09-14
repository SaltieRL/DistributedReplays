from backend.database.objects import PlayerGame


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
    def create_from_player_game(player_game: PlayerGame) -> 'ReplayPlayer':
        return ReplayPlayer(
            id_=player_game.player,
            name=player_game.name,
            is_orange=player_game.is_orange,
            score=player_game.score,
            goals=player_game.goals,
            assists=player_game.assists,
            saves=player_game.saves,
            shots=player_game.shots
        )

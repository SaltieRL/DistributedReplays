from typing import List

from flask import current_app

from backend.database.objects import Game
from .replay_player import ReplayPlayer
from ..errors.errors import ReplayNotFound


class GameScore:
    def __init__(self, team_0_score: int, team_1_score: int):
        self.team0Score = team_0_score
        self.team1Score = team_1_score

    @staticmethod
    def create_from_game(game: Game):
        return GameScore(game.team0score, game.team1score)


class Replay:
    def __init__(self, name: str, date: str,
                 game_mode: str, game_score: GameScore,
                 players: List[ReplayPlayer]):
        self.name = name
        self.date = date
        self.gameMode = game_mode
        self.gameScore = game_score.__dict__
        self.players = [player.__dict__ for player in players]

    @staticmethod
    def create_from_id(id_: str) -> 'Replay':
        session = current_app.config['db']()
        game = session.query(Game).filter(Game.hash == id_).first()
        if game is None:
            raise ReplayNotFound()
        return Replay.create_from_game(game)

    @staticmethod
    def create_from_game(game: Game) -> 'Replay':
        return Replay(
            name=game.name,
            date=game.match_date.isoformat(),
            game_mode=f"{game.teamsize}'s",
            game_score=GameScore.create_from_game(game),
            players=sorted(ReplayPlayer.create_from_game(game),
                           key=lambda player: player.isOrange)
        )
from typing import List, cast

from flask import current_app

from backend.database.objects import Game, PlayerGame
from .replay_player import ReplayPlayer
from ..utils import sort_player_games_by_team_then_id
from ...errors.errors import ReplayNotFound


class GameScore:
    def __init__(self, team_0_score: int, team_1_score: int):
        self.team0Score = team_0_score
        self.team1Score = team_1_score

    @staticmethod
    def create_from_game(game: Game):
        return GameScore(game.team0score, game.team1score)


class Replay:
    def __init__(self, id_: str, name: str, date: str,
                 game_mode: str, game_score: GameScore,
                 players: List[ReplayPlayer]):
        self.id = id_
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
        replay = Replay.create_from_game(game)
        session.close()
        return replay

    @staticmethod
    def create_from_game(game: Game) -> 'Replay':
        return Replay(
            id_=game.hash,
            name=game.name,
            date=game.match_date.isoformat(),
            game_mode=Replay.create_name_from_playlist(game.playlist, game.teamsize),
            game_score=GameScore.create_from_game(game),
            players=[
                ReplayPlayer.create_from_player_game(player_game)
                for player_game in sort_player_games_by_team_then_id(
                    cast(List[PlayerGame], game.playergames))
            ]
        )

    @staticmethod
    def create_name_from_playlist(id_: int, teamsize: int) -> str:
        mapping = {
            1: 'Duels (U)',
            2: 'Doubles (U)',
            3: 'Standard (U)',
            4: 'Chaos (U)',
            6: 'Custom',
            8: 'Offline',
            10: 'Duels',
            11: 'Doubles',
            12: 'Solo Standard',
            13: 'Standard',
            15: 'Snow Day (U)',
            16: 'Rocket Labs',
            17: 'Hoops (U)',
            18: 'Rumble (U)',
            23: 'Dropshot (U)',
            25: 'Anniversary',
            27: 'Hoops',
            28: 'Rumble',
            29: 'Dropshot',
            30: 'Snow Day'
        }
        if id_ in mapping:
            return mapping[id_]
        return f"{teamsize}'s"

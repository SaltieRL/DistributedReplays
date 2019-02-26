from typing import List, cast

from flask import g

from backend.database.objects import Game, PlayerGame, GameVisibilitySetting
from data.constants.playlist import get_playlist
from .replay_player import ReplayPlayer
from .tag import Tag
from ..utils import sort_player_games_by_team_then_id, with_session
from ...errors.errors import ReplayNotFound


class GameScore:
    def __init__(self, team_0_score: int, team_1_score: int):
        self.team0Score = team_0_score
        self.team1Score = team_1_score

    @staticmethod
    def create_from_game(game: Game):
        return GameScore(game.team0score, game.team1score)


class Replay:
    def __init__(self, id_: str, name: str, date: str, map: str,
                 game_mode: str, game_score: GameScore,
                 players: List[ReplayPlayer], tags: List[Tag], visibility: GameVisibilitySetting):
        self.id = id_
        self.name = name
        self.date = date
        self.map = map
        self.gameMode = game_mode
        self.gameScore = game_score.__dict__
        self.players = [player.__dict__ for player in players]
        self.tags = [tag.__dict__ for tag in tags]
        self.visibility = visibility.value

    @staticmethod
    @with_session
    def create_from_id(id_: str, session=None) -> 'Replay':
        game = session.query(Game).filter(Game.hash == id_).first()
        if game is None:
            raise ReplayNotFound()
        replay = Replay.create_from_game(game)
        return replay

    @staticmethod
    def create_from_game(game: Game) -> 'Replay':
        return Replay(
            id_=game.hash,
            name=game.name,
            date=game.match_date.isoformat(),
            map=game.map,
            game_mode=get_playlist(game.playlist, game.teamsize),
            game_score=GameScore.create_from_game(game),
            players=[
                ReplayPlayer.create_from_player_game(player_game)
                for player_game in sort_player_games_by_team_then_id(
                    cast(List[PlayerGame], game.playergames))
            ],
            tags=[
                Tag.create_from_dbtag(tag)
                for tag in game.tags if tag.owner == g.user.platformid
            ],
            visibility=game.visibility
        )

import datetime
from enum import Enum, auto
from typing import List

from .ApiPlayer import ApiPlayer
from .ApiTeam import ApiTeam

from .ApiGoal import ApiGoal

from replayanalysis.game.game import Game


class ApiGameMap(Enum):
    Map1 = auto

    @staticmethod
    def get_map_from_name(name):
        return ApiGameMap.Map1


# noinspection PyPep8Naming
class ApiGameScore:
    def __init__(self, team0Score: int = None, team1Score: int = None):
        self.team0Score = team0Score
        self.team1Score = team1Score


class ApiGame:
    def __init__(self, map: ApiGameMap = None, version: int = None, time: datetime.datetime = None, frames: int = None,
                 score: ApiGameScore = None, teams: List[ApiTeam] = None, players: List[ApiPlayer] = None,
                 goals: List[ApiGoal] = None):
        self.map = map
        self.version = version
        self.time = time
        self.frames = frames
        self.score = score
        self.teams = teams
        self.players = players
        self.goals = goals

    @staticmethod
    def create_from_game(game: Game):
        pass

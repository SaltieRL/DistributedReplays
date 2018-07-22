import datetime
import json
from enum import Enum, auto
from typing import List

from api_return_classes.ApiGoal import ApiGoal
from api_return_classes.ApiTeam import ApiTeam
from replayanalysis.game.game import Game


class ApiGameMap(Enum):
    Map1 = auto

    @staticmethod
    def get_map_from_name(name):
        # TODO: Implement more maps.
        # Maps are strings in the pickled game - e.g. 'cs_p'
        # JSON-ing should use the apiGameMap object's .name attribute which is a string
        # Create with `api_game_map = ApiGameMap[pickled_game.map]`
        # I'm not sure if this class is needed. It simply casts the game's .map into one of our specified strings
        # which might be unnecessary
        return ApiGameMap.Map1


# noinspection PyPep8Naming
class ApiGameScore:
    def __init__(self, team0Score: int = None, team1Score: int = None):
        self.team0Score = team0Score
        self.team1Score = team1Score

    @staticmethod
    def create_from_game(game):
        for team in game.teams:
            if team.is_orange:
                team_1_score = team.score
            else:
                team_0_score = team.score
        return ApiGameScore(team_0_score, team_1_score)


class ApiGame:
    def __init__(self, _map: ApiGameMap = None, version: int = None, time: datetime.datetime = None, frames: int = None,
                 score: ApiGameScore = None, teams: List[ApiTeam] = None, goals: List[ApiGoal] = None):
        self.map = _map
        self.version = version
        self.time = time.isoformat()
        self.frames = frames
        self.score = score
        self.teams = teams
        self.goals = goals

    @staticmethod
    def create_from_game(game: Game):
        return ApiGame(
            _map=game.map,
            version=game.replay_version,
            time=game.datetime,
            frames=game.frames.index.max(),
            score=ApiGameScore.create_from_game(game),
            teams=ApiTeam.create_teams_from_game(game),
            goals=ApiGoal.create_goals_from_game(game)
        )

    def to_json(self) -> str:
        return json.dumps(self, default=lambda o: getattr(o, '__dict__', str(o)))


if __name__ == '__main__':
    import os
    import pickle

    base_dir = os.path.dirname(os.path.dirname(__file__))
    print(base_dir)
    with open(os.path.join(base_dir, 'parsed', "7.replay.pkl"), 'rb') as f:
        pickled_game = pickle.load(f)
        print(pickled_game)

    api_game = ApiGame.create_from_game(pickled_game)
    json_api_game = api_game.to_json()
    with open('x.json', 'w') as f:
        f.write(json_api_game)

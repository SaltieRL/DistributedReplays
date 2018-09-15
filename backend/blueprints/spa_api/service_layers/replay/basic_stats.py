from typing import List, cast

from flask import current_app

from backend.database.objects import Game, PlayerGame
from ..chart_data import ChartData, ChartDataPoint
from ..utils import sort_player_games_by_team_then_id
from ...errors.errors import ReplayNotFound

chart_types = {
    'radar': ['total_hits', 'total_dribbles', 'total_passes', 'total_aerials', 'turnovers', 'average_speed',
              'average_hit_distance', 'ball_hit_forward', 'time_high_in_air', 'time_low_in_air', 'wasted_collection',
              'time_in_attacking_half', 'time_in_defending_half', 'possession_time', 'boost_usage'],
    'pie': ['possession_time', 'boost_usage'],
    'bar': ['total_dribbles', 'total_passes', 'total_aerials', 'ball_hit_forward', 'ball_hit_backward',
            'time_high_in_air', 'time_low_in_air', 'wasted_collection']
}

chart_to_ball = {
    chart_stat: chart_type
    for chart_type in chart_types for chart_stat in chart_types[chart_type]
}


class StatDataPoint(ChartDataPoint):
    def __init__(self, name: str, value: float, is_orange: bool):
        super().__init__(name, value)
        self.isOrange = is_orange


class BasicStatChartData(ChartData):
    def __init__(self, title: str, chart_data_points: List[ChartDataPoint], type_: str):
        super().__init__(title, chart_data_points)
        self.type = type_

    @staticmethod
    def create_from_id(id_: str) -> List['BasicStatChartData']:
        session = current_app.config['db']()
        game: Game = session.query(Game).filter(Game.hash == id_).first()
        if game is None:
            raise ReplayNotFound()

        all_chart_data = []
        for chart_stat, chart_type in chart_to_ball.items():
            chart_data = BasicStatChartData(
                title=chart_stat,
                chart_data_points=[
                    StatDataPoint(
                        name=player_game.name,
                        value=player_game.__getattribute__(chart_stat),  # TODO: Investigate proper way to do this
                        is_orange=player_game.is_orange
                    )
                    for player_game in sort_player_games_by_team_then_id(
                        cast(List[PlayerGame], game.playergames))
                ],
                type_=chart_type
            )
            all_chart_data.append(chart_data)
        return all_chart_data

from flask import current_app

from backend.database.objects import Game
from ..errors.errors import ReplayNotFound

chart_types = {
    'spider': ['total_hits', 'total_dribbles', 'total_passes', 'total_aerials', 'turnovers', 'average_speed',
               'average_hit_distance', 'ball_hit_forward', 'time_high_in_air', 'time_low_in_air', 'wasted_collection',
               'time_in_attacking_half', 'time_in_defending_half', 'possession_time', 'boost_usage'],
    'pie': ['possession_time', 'boost_usage'],
    'bar': ['total_dribbles', 'total_passes', 'total_aerials', 'ball_hit_forward', 'ball_hit_backward',
            'time_high_in_air', 'time_low_in_air', 'wasted_collection']
}

chart_to_ball = {
    chart_name: chart_type
    for chart_type in chart_types for chart_name in chart_types[chart_type]
}


class BasicStat:
    def __init__(self):
        self.barCharts = bar_charts
        self.pieCharts = pie_charts
        self.spiderCharts = spider_charts

    @staticmethod
    def create_from_id(id_: str) -> 'BasicStat':
        session = current_app.config['db']()
        game = session.query(Game).filter(Game.hash == id_).first()
        if game is None:
            raise ReplayNotFound()

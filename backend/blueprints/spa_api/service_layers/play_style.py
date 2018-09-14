from typing import List

from flask import current_app

from backend.blueprints.spa_api.service_layers.chart_data import ChartData, ChartDataPoint
from .player_profile_stats import player_stat_wrapper, player_wrapper
from ..errors.errors import UserHasNoReplays


class PlayStyleChartData(ChartData):

    @staticmethod
    def create_from_id(id_: str) -> List['PlayStyleChartData']:
        session = current_app.config['db']()
        game_count = player_wrapper.get_total_games(session, id_)
        if game_count == 0:
            raise UserHasNoReplays()
        averaged_stats = player_stat_wrapper.get_averaged_stats(session, id_)
        spider_charts_groups = player_stat_wrapper.get_stat_spider_charts()

        play_style_chart_datas = []
        for spider_chart_group in spider_charts_groups:
            title = spider_chart_group['title']
            chart_data_points = [
                ChartDataPoint(name=name, value=averaged_stats[name])
                for name in spider_chart_group['group']
            ]
            play_style_chart_datas.append(PlayStyleChartData(title, chart_data_points))

        return play_style_chart_datas

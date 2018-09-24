from typing import List

from flask import current_app

from backend.blueprints.spa_api.errors.errors import UserHasNoReplays, CalculatedError
from backend.utils.psyonix_api_handler import get_rank
from .player_profile_stats import player_stat_wrapper, player_wrapper
from ..chart_data import ChartData, ChartDataPoint


class PlayStyleChartData(ChartData):
    pass


class PlayStyleResponse:
    showWarningThreshold: int = 10

    def __init__(self, chart_datas: List[PlayStyleChartData], show_warning: bool):
        self.chartDatas = [chart_data.__dict__ for chart_data in chart_datas]
        self.showWarning = show_warning

    @classmethod
    def create_from_id(cls, id_: str, raw=False, rank=None):
        session = current_app.config['db']()
        game_count = player_wrapper.get_total_games(session, id_)
        if game_count == 0:
            raise UserHasNoReplays()
        if rank is None:
            rank = get_rank(id_)
        averaged_stats, global_stats = player_stat_wrapper.get_averaged_stats(session, id_, raw=raw, rank=rank)
        spider_charts_groups = player_stat_wrapper.get_stat_spider_charts()

        play_style_chart_datas: List[PlayStyleChartData] = []
        for spider_chart_group in spider_charts_groups:
            title = spider_chart_group['title']
            chart_data_points = [
                ChartDataPoint(name=name, value=averaged_stats[name], average=global_stats[name])
                for name in spider_chart_group['group']
            ]
            play_style_chart_datas.append(PlayStyleChartData(title, chart_data_points))
        session.close()

        return PlayStyleResponse(
            chart_datas=play_style_chart_datas,
            show_warning=game_count <= cls.showWarningThreshold
        )

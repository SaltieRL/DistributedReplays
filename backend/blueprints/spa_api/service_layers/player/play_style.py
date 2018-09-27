from typing import List

from flask import current_app

from backend.blueprints.spa_api.errors.errors import UserHasNoReplays
from backend.blueprints.spa_api.service_layers.stat import ProgressionDataPoint, DataPoint, PlayerDataPoint
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
    def create_from_id(cls, id_: str, raw=False, rank=None, ids=None):
        session = current_app.config['db']()
        game_count = player_wrapper.get_total_games(session, id_)
        if game_count == 0:
            raise UserHasNoReplays()
        if rank is None:
            rank = get_rank(id_)
        averaged_stats, global_stats = player_stat_wrapper.get_averaged_stats(session, id_,
                                                                              redis=current_app.config['r'], raw=raw,
                                                                              rank=rank, ids=ids)
        spider_charts_groups = player_stat_wrapper.get_stat_spider_charts()

        play_style_chart_datas: List[PlayStyleChartData] = []
        for spider_chart_group in spider_charts_groups:
            title = spider_chart_group['title']
            chart_data_points = [
                ChartDataPoint(name=name.title(), value=averaged_stats[name], average=global_stats[name])
                for name in spider_chart_group['group']
            ]
            play_style_chart_datas.append(PlayStyleChartData(title, chart_data_points))
        session.close()

        return PlayStyleResponse(
            chart_datas=play_style_chart_datas,
            show_warning=game_count <= cls.showWarningThreshold
        )

    @classmethod
    def create_progression(cls, id_: str) -> List[ProgressionDataPoint]:
        session = current_app.config['db']()
        game_count = player_wrapper.get_total_games(session, id_)
        if game_count == 0:
            raise UserHasNoReplays()
        data = player_stat_wrapper.get_progression_stats(session, id_)
        progression_data: List[ProgressionDataPoint] = []
        for data_point in data:
            progression_data.append(ProgressionDataPoint(data_point['name'],
                                                         [DataPoint(k, data_point['average'][k],
                                                                    data_point['std_dev'][k])
                                                          for k in data_point['average']]))
        session.close()
        return progression_data

    @classmethod
    def create_all_stats_from_id(cls, id_: str, rank=None, ids=None) -> PlayerDataPoint:
        session = current_app.config['db']()
        game_count = player_wrapper.get_total_games(session, id_)
        if game_count == 0:
            raise UserHasNoReplays()
        if rank is None:
            rank = get_rank(id_)
        averaged_stats, global_stats = player_stat_wrapper.get_averaged_stats(session, id_,
                                                                              redis=current_app.config['r'], raw=True,
                                                                              rank=rank, ids=ids)
        playstyle_data_raw: PlayerDataPoint = PlayerDataPoint(name=id_, points=[DataPoint(k, averaged_stats[k]) for k in
                                                                                averaged_stats])

        return playstyle_data_raw

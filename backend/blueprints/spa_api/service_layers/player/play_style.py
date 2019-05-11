from typing import List, Tuple

from flask import current_app
from sqlalchemy import func, desc

from backend.blueprints.spa_api.errors.errors import UserHasNoReplays
from backend.blueprints.spa_api.service_layers.stat import DataPoint, PlayerDataPoint
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import PlayerGame
from backend.database.wrapper.chart.chart_data import ChartData, ChartDataPoint
from backend.utils.psyonix_api_handler import get_rank
from .player_profile_stats import player_stat_wrapper, player_wrapper

explanations = player_stat_wrapper.player_stats.stat_explanation_map


class PlayStyleChartData(ChartData):
    pass


class PlayStyleResponse:
    showWarningThreshold: int = 10

    def __init__(self, chart_datas: List[PlayStyleChartData], show_warning: bool):
        self.chartDatas = [chart_data.__dict__ for chart_data in chart_datas]
        self.showWarning = show_warning

    @classmethod
    @with_session
    def create_from_id(cls, id_: str, raw=False, rank=None, replay_ids=None, playlist=13, win=None, session=None):
        game_count = player_wrapper.get_total_games(session, id_)
        if game_count == 0:
            raise UserHasNoReplays()
        if rank is None:
            rank = get_rank(id_)
        averaged_stats = player_stat_wrapper.get_averaged_stats(session, id_,
                                                                redis=current_app.config['r'], raw=raw,
                                                                rank=rank, replay_ids=replay_ids,
                                                                playlist=playlist, win=win)
        spider_charts_groups = player_stat_wrapper.get_stat_spider_charts()

        play_style_chart_datas: List[PlayStyleChartData] = []
        for spider_chart_group in spider_charts_groups:
            title = spider_chart_group['title']
            chart_data_points = [
                ChartDataPoint(name=explanations[name].short_name if name in explanations else name,
                               value=averaged_stats[name])
                for name in spider_chart_group['group']
            ]
            play_style_chart_datas.append(PlayStyleChartData(title, chart_data_points))

        return PlayStyleResponse(
            chart_datas=play_style_chart_datas,
            show_warning=game_count <= cls.showWarningThreshold
        )

    @staticmethod
    @with_session
    def create_all_stats_from_id(id_: str, rank: int = None, replay_ids: List[str] = None, playlist: int = 13,
                                 win: bool = None, session=None) -> PlayerDataPoint:
        game_count = player_wrapper.get_total_games(session, id_)
        if game_count == 0:
            raise UserHasNoReplays()
        if rank is None:
            rank = get_rank(id_)
        averaged_stats = player_stat_wrapper.get_averaged_stats(session, id_,
                                                                redis=current_app.config['r'], raw=True,
                                                                rank=rank, replay_ids=replay_ids,
                                                                playlist=playlist, win=win)
        if len(id_) == 11 and id_[0] == 'b' and id_[-1] == 'b':
            names_and_counts: List[Tuple[str, int]] = session.query(PlayerGame.name,
                                                                    func.count(PlayerGame.name).label('c')) \
                                                          .filter(PlayerGame.player == id_) \
                                                          .group_by(PlayerGame.name).order_by(desc('c'))[:5]
            id_ = names_and_counts[0][0]
        playstyle_data_raw: PlayerDataPoint = PlayerDataPoint(name=id_,
                                                              data_points=[
                                                                  DataPoint(explanations[
                                                                                k].field_rename if k in explanations else k,
                                                                            averaged_stats[k])
                                                                  for k in averaged_stats
                                                              ])
        return playstyle_data_raw

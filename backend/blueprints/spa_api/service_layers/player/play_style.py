from typing import List

from flask import current_app

from backend.blueprints.spa_api.errors.errors import UserHasNoReplays
from backend.blueprints.spa_api.service_layers.stat import DataPoint, PlayerDataPoint
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.utils.psyonix_api_handler import get_rank
from .player_profile_stats import player_stat_wrapper, player_wrapper
from backend.database.wrapper.chart.chart_data import ChartData, ChartDataPoint

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
    def create_from_id(cls, id_: str, raw=False, rank=None, replay_ids: List[str] = None, playlist=13, win: bool = None,
                       user_id: str = None, session=None):
        """


        :param id_: User id to lookup for stats (i.e. what profile we are looking at
        :param raw: If the values should be sent back without normalizing by rank
        :param rank: What rank to normalize against
        :param replay_ids: List of replay ids to pull from. Empty means all
        :param playlist: What playlist to normalize against
        :param win: If set, true means use only wins, false means use only losses
        :param user_id: User id to pull chart settings from
        :param session: Database session (automatically populated if not set)
        :return: PlayStyleResponse
        """
        print("User id:", user_id)
        game_count = player_wrapper.get_total_games(session, id_)
        if game_count == 0:
            raise UserHasNoReplays()
        if rank is None:
            rank = get_rank(id_)
        averaged_stats, global_stats = player_stat_wrapper.get_averaged_stats(session, id_,
                                                                              redis=current_app.config['r'], raw=raw,
                                                                              rank=rank, replay_ids=replay_ids,
                                                                              playlist=playlist, win=win)
        spider_charts_groups = player_stat_wrapper.get_stat_spider_charts(user_id, session=session)
        print(averaged_stats)
        play_style_chart_datas: List[PlayStyleChartData] = []
        for spider_chart_group in spider_charts_groups:
            title = spider_chart_group['title']
            chart_data_points = [
                ChartDataPoint(name=explanations[name].short_name if name in explanations else name,
                               value=averaged_stats[name], average=global_stats[name])
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
        averaged_stats, global_stats = player_stat_wrapper.get_averaged_stats(session, id_,
                                                                              redis=current_app.config['r'], raw=True,
                                                                              rank=rank, replay_ids=replay_ids,
                                                                              playlist=playlist, win=win)
        playstyle_data_raw: PlayerDataPoint = PlayerDataPoint(name=id_,
                                                              data_points=[
                                                                  DataPoint(explanations[
                                                                                k].field_rename if k in explanations else k,
                                                                            averaged_stats[k])
                                                                  for k in averaged_stats
                                                              ])
        return playstyle_data_raw

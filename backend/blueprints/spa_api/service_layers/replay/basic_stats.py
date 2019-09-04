from typing import List

from backend.database.wrapper.chart.player_chart_metadata import player_group_stats_metadata
from backend.database.wrapper.chart.stat_point import OutputChartData
from backend.database.wrapper.chart.team_chart_metadata import team_stats_metadata
from backend.database.wrapper.stats.chart_stats_wrapper import ChartStatsWrapper

wrapper = ChartStatsWrapper()


class PlayerStatsChart:
    @staticmethod
    def create_from_id(current_app, id_: str) -> List[OutputChartData]:
        wrapped_player_games = wrapper.get_chart_stats_for_player(id_)
        protobuf_stats = wrapper.get_protobuf_stats(current_app, id_)
        all_basic_stats = wrapper.merge_stats(wrapped_player_games, protobuf_stats)
        return wrapper.wrap_chart_stats(all_basic_stats, player_group_stats_metadata)


class TeamStatsChart:
    @staticmethod
    def create_from_id(id_: str) -> List[OutputChartData]:
        return wrapper.wrap_chart_stats(wrapper.get_chart_stats_for_team(id_), team_stats_metadata)

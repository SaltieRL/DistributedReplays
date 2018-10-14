from typing import List

from flask import current_app
from backend.database.wrapper.chart.player_chart_metadata import player_stats_metadata
from backend.database.wrapper.chart.stat_point import OutputChartData
from backend.database.wrapper.stats.chart_stats_wrapper import ChartStatsWrapper

wrapper = ChartStatsWrapper()

class BasicStatsChart:

    @staticmethod
    def create_from_id(id_: str) -> List[OutputChartData]:
        session = current_app.config['db']()
        wrapped_playergames = wrapper.get_chart_stats_for_player(session, id_)

        return wrapper.wrap_chart_stats(wrapped_playergames, player_stats_metadata)

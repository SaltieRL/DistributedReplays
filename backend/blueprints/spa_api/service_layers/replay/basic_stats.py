from typing import List

from flask import current_app

from backend.database.wrapper.chart.player_chart_metadata import player_stats_metadata
from backend.database.wrapper.chart.stat_point import OutputChartData
from backend.database.wrapper.chart.team_chart_metadata import team_stats_metadata
from backend.database.wrapper.stats.chart_stats_wrapper import ChartStatsWrapper

wrapper = ChartStatsWrapper()


class PlayerStatsChart:
    @staticmethod
    def create_from_id(id_: str) -> List[OutputChartData]:
        session = current_app.config['db']()
        try:
            wrapped_player_games = wrapper.get_chart_stats_for_player(session, id_)
        except Exception as e:
            session.close()
            raise e
        session.close()
        return wrapper.wrap_chart_stats(wrapped_player_games, player_stats_metadata)


class TeamStatsChart:
    @staticmethod
    def create_from_id(id_: str) -> List[OutputChartData]:
        session = current_app.config['db']()
        wrapped_team_games = wrapper.get_chart_stats_for_team(session, id_)
        session.close()
        return wrapper.wrap_chart_stats(wrapped_team_games, team_stats_metadata)

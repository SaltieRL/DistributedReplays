from typing import List

from flask import current_app

from backend.database.wrapper.chart.chart_data import ChartData, ChartDataPoint
from backend.database.wrapper import player_wrapper
from backend.database.wrapper.chart.player_chart_metadata import player_stats_metadata
from backend.database.wrapper.stats import player_stat_wrapper

wrapper = player_stat_wrapper.PlayerStatWrapper(player_wrapper.PlayerWrapper(limit=10))


class ReplayGroupChartData(ChartData):
    def __init__(self, title: str, chart_data_points: List[ChartDataPoint], type_: str, subcategory: str):
        super().__init__(title, chart_data_points)
        self.type = type_
        self.subcategory = subcategory

    @staticmethod
    def create_from_ids(ids: List[str]) -> List['ReplayGroupChartData']:
        stats = wrapper.get_group_stats(ids)

        players = list(stats['playerStats'].keys())
        if 'ensembleStats' in stats:
            players.append('ensembleStats')
        all_chart_data = []
        for chart_metadata in player_stats_metadata:
            chart_data = ReplayGroupChartData(
                title=chart_metadata.stat_name,
                chart_data_points=[
                    ChartDataPoint(
                        name=stats['playerStats'][player_id]['name'] if player_id in stats[
                            'playerStats'] else 'Ensemble',
                        value=stats['playerStats'][player_id]['average'].get(chart_metadata.stat_name, 0)
                        if player_id in stats['playerStats']
                        else stats[player_id]['average'].get(chart_metadata.stat_name, 0),
                    )
                    for player_id in players
                ],
                type_=chart_metadata.type,
                subcategory=chart_metadata.subcategory
            )
            if all(chart_data_point['value'] is None or chart_data_point['value'] == 0 for chart_data_point in
                   chart_data.chartDataPoints):
                continue
            all_chart_data.append(chart_data)

        return all_chart_data

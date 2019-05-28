import logging

from typing import List

from flask import current_app

from backend.database.wrapper import player_wrapper
from backend.database.wrapper.chart.chart_data import ChartData, ChartDataPoint
from backend.database.wrapper.chart.player_chart_metadata import player_group_stats_metadata
from backend.database.wrapper.chart.stat_point import StatDataPoint
from backend.database.wrapper.stats import player_stat_wrapper

logger = logging.getLogger(__name__)

wrapper = player_stat_wrapper.PlayerStatWrapper(player_wrapper.PlayerWrapper(limit=10))


class ReplayGroupChartData(ChartData):
    def __init__(self, title: str, chart_data_points: List[ChartDataPoint], type_: str, subcategory: str):
        super().__init__(title, chart_data_points)
        self.type = type_
        self.subcategory = subcategory

    @staticmethod
    def create_from_ids(ids: List[str]) -> List['ReplayGroupChartData']:
        stats = wrapper.get_group_stats(ids)
        player_stats = stats['playerStats']
        player_names = [player['name'] for player in player_stats]
        if 'ensembleStats' in stats:
            player_stats.append(stats['ensembleStats'])
        
        categories = list(player_stats[0]['stats'].keys())

        all_chart_data = []

        for chart_metadata in player_group_stats_metadata:
            for category in categories:
                chart_data_points = []
                for player in player_stats:
                    name = player['name'] if 'name' in player and player['name'] in player_names else 'Ensemble'
                    value = player['stats'][category].get(chart_metadata.stat_name, 0)
                    is_orange = player['is_orange'] if 'is_orange' in player else None

                    if is_orange is not None:
                        chart_data_points.append(StatDataPoint(
                            name=name,
                            value=value,
                            is_orange=is_orange
                        ))
                    else:
                        chart_data_points.append(ChartDataPoint(
                            name=name,
                            value=value
                        ))
                
                chart_data = ReplayGroupChartData(
                    title=chart_metadata.stat_name + ' ' + category,
                    chart_data_points=chart_data_points,
                    type_=chart_metadata.type,
                    subcategory=chart_metadata.subcategory
                )
                if all(chart_data_point['value'] is None or chart_data_point['value'] == 0 for chart_data_point in
                    chart_data.chartDataPoints):
                    continue
                all_chart_data.append(chart_data)

        return all_chart_data

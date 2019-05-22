import logging

from typing import List

from flask import current_app

from backend.database.wrapper.chart.chart_data import ChartData, ChartDataPoint
from backend.database.wrapper import player_wrapper
from backend.database.wrapper.chart.player_chart_metadata import player_stats_metadata
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

        players = list(stats['playerStats'].keys())
        if 'ensembleStats' in stats:
            players.append('ensembleStats')
        
        categories = list(stats['playerStats'][players[0]]['stats'].keys())

        all_chart_data = []
        
        player_stats_metadata_list = [chart_metadata.stat_name for chart_metadata in player_stats_metadata]
        stats_list = list(stats['playerStats'][players[0]]['stats'][categories[0]].keys())
        only_player_stats_metadata = list(set(player_stats_metadata_list) - set(stats_list))
        if only_player_stats_metadata:
            logger.warning('only player_stats_metadata')
            logger.warning(','.join(only_player_stats_metadata))
            logger.warning('')
        only_stats = list(set(stats_list) - set(player_stats_metadata_list))
        if only_stats:
            logger.warning('only stats')
            logger.warning(','.join(only_stats))
            logger.warning('')

        for chart_metadata in player_stats_metadata:
            for category in categories:
                chart_data = ReplayGroupChartData(
                    title=chart_metadata.stat_name + ' ' + category,
                    chart_data_points=[
                        ChartDataPoint(
                            name=stats['playerStats'][player_id]['name'] if player_id in stats[
                                'playerStats'] else 'Ensemble',
                            value=stats['playerStats'][player_id]['stats'][category].get(chart_metadata.stat_name, 0)
                            if player_id in stats['playerStats']
                            else stats[player_id]['stats'][category].get(chart_metadata.stat_name, 0),
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

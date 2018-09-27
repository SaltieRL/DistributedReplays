from typing import List

from flask import current_app

from backend.database.wrapper import player_wrapper
from backend.database.wrapper.stats import player_stat_wrapper
from ..chart_data import ChartData, ChartDataPoint
from .basic_stats import basic_stats_metadatas

wrapper = player_stat_wrapper.PlayerStatWrapper(player_wrapper.PlayerWrapper(limit=10))
avg_list, field_list, std_list = wrapper.get_stats_query()


class StatDataPoint(ChartDataPoint):
    def __init__(self, name: str, value: float, is_orange: bool):
        super().__init__(name, value)
        self.isOrange = is_orange


class GroupChartData(ChartData):
    def __init__(self, title: str, chart_data_points: List[StatDataPoint], type_: str, subcategory: str):
        super().__init__(title, chart_data_points)
        self.type = type_
        self.subcategory = subcategory

    @staticmethod
    def create_from_ids(ids: List[str]) -> List['GroupChartData']:

        session = current_app.config['db']()
        stats = wrapper.get_group_stats(session, ids)
        session.close()
        players = list(stats['playerStats'].keys())
        if 'ensembleStats' in stats:
            players += ['ensembleStats']
        all_chart_data = []
        for basic_stats_metadata in basic_stats_metadatas:
            chart_data = GroupChartData(
                title=basic_stats_metadata.stat_name,
                chart_data_points=[
                    StatDataPoint(
                        name=stats['playerStats'][p]['name'] if p in stats['playerStats'] else 'Ensemble',
                        value=stats['playerStats'][p]['average'].get(basic_stats_metadata.stat_name, 0) if p in stats[
                            'playerStats'] else stats[p]['average'].get(basic_stats_metadata.stat_name, 0),
                        # TODO: Investigate proper way to get attribute
                        is_orange=False
                    )
                    for p in players
                ],
                type_=basic_stats_metadata.type,
                subcategory=basic_stats_metadata.subcategory
            )
            if all(chart_data_point['value'] is None or chart_data_point['value'] == 0 for chart_data_point in
                   chart_data.chartDataPoints):
                continue
            all_chart_data.append(chart_data)
        session.close()
        return all_chart_data

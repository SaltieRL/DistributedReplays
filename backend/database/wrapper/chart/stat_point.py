from typing import List

from backend.database.wrapper.chart.chart_data import ChartDataPoint, ChartData


class StatDataPoint(ChartDataPoint):
    def __init__(self, name: str, value: float, is_orange: bool):
        """
        :param name: The name of the player
        :param value: The value of the stat
        :param is_orange: If the stat is for the orange team.
        """
        super().__init__(name, value)
        self.isOrange = is_orange


class DatabaseObjectDataPoint:
    def __init__(self, id: int, name: str, is_orange: bool, stats: dict):
        """
        :param id: The Id of the player
        :param name:  The name of the player
        :param is_orange:  If the player is on the orange team
        :param stats:  A dictionary of all stats associated with this player.
        """
        self.id = id
        self.name = name
        self.is_orange = is_orange
        self.stats = stats


class OutputChartData(ChartData):
    def __init__(self, title: str, chart_data_points: List[StatDataPoint], type_: str, subcategory: str):
        """
        :param title: The title of the chart.
        :param chart_data_points: The
        :param type_:
        :param subcategory:
        """
        super().__init__(title, chart_data_points)
        self.type = type_
        self.subcategory = subcategory

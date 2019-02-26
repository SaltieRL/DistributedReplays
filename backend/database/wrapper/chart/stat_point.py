from typing import List

from backend.database.wrapper.chart.chart_data import ChartDataPoint, ChartData


class StatDataPoint(ChartDataPoint):
    def __init__(self, name: str, value: float, is_orange: bool):
        super().__init__(name, value)
        self.isOrange = is_orange


class DatabaseObjectDataPoint:
    def __init__(self, id: int, name: str, is_orange: bool, stats: dict):
        self.id = id
        self.name = name
        self.is_orange = is_orange
        self.stats = stats


class OutputChartData(ChartData):
    def __init__(self, title: str, chart_data_points: List[StatDataPoint], type_: str, subcategory: str):
        super().__init__(title, chart_data_points)
        self.type = type_
        self.subcategory = subcategory

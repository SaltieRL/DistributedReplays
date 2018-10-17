from enum import Enum, auto
from typing import List, Optional


class ChartDataPoint:
    def __init__(self, name: str, value: float, average: Optional[float] = None):
        self.name = name
        self.value = value
        if average is not None:
            self.average = average


class ChartData:
    def __init__(self, title: str, chart_data_points: List[ChartDataPoint]):
        self.title = title
        self.chartDataPoints = [chart_data_point.__dict__ for chart_data_point in chart_data_points]


class ChartType(Enum):
    radar = auto()
    bar = auto()
    pie = auto()


class ChartSubcatagory(Enum):
    pass

class ChartStatsMetadata:
    def __init__(self, stat_name: str, type_: ChartType, subcategory: ChartSubcatagory):
        self.stat_name = stat_name
        self.type = type_.name
        self.subcategory = subcategory.name



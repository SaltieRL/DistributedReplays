from typing import List


class DataPoint:
    def __init__(self, name: str, average: float, std_dev: float = None):
        self.name = name
        self.average = average
        if std_dev is not None:
            self.stdDev = std_dev


class ProgressionDataPoint:
    def __init__(self, date: str, data_points: List[DataPoint]):
        self.date = date
        self.dataPoints = [data_point.__dict__ for data_point in data_points]


class PlayerDataPoint:
    def __init__(self, name: str, data_points: List[DataPoint]):
        self.name = name
        self.dataPoints = [data_point.__dict__ for data_point in data_points]

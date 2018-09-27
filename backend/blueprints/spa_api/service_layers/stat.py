from typing import List


class DataPoint:
    def __init__(self, name: str, average: float, std_dev: float = None):
        self.name = name
        self.average = average
        if std_dev is not None:
            self.std_dev = std_dev


class ProgressionDataPoint:
    def __init__(self, date: str, points: List[DataPoint]):
        self.date = date
        self.points = [point.__dict__ for point in points]


class PlayerDataPoint:
    def __init__(self, name: str, points: List[DataPoint]):
        self.name = name
        self.points = [point.__dict__ for point in points]

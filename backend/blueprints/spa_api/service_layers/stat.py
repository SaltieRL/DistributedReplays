from typing import List
from .player.player_profile_stats import player_wrapper, player_stat_wrapper


class DataPoint:
    def __init__(self, name: str, average: float, std_dev: float = None):
        self.name = name
        self.average = average
        if std_dev is not None:
            self.stdDev = std_dev


class ProgressionDataPoint:
    def __init__(self, date: str, data_points: List[DataPoint], count=None):
        self.date = date
        self.dataPoints = [data_point.__dict__ for data_point in data_points]
        self.replayCount = count


class PlayerDataPoint:
    def __init__(self, name: str, data_points: List[DataPoint]):
        self.name = name
        self.dataPoints = [data_point.__dict__ for data_point in data_points]


def get_explanations():
    return {stat.field_rename if stat.field_rename is not None else stat.field_name: stat.__dict__ for name, stat in
            player_stat_wrapper.player_stats.stat_explanation_map.items()}

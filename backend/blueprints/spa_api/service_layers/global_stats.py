import json
import logging
from typing import List

from flask import current_app

logger = logging.getLogger(__name__)


class GlobalStatsMetadata:
    def __init__(self, name: str, field: str):
        self.name = name
        self.field = field


class GlobalStatsGraphDataset:
    def __init__(self, name: str, keys: List[float], values: List[float]):
        self.name = name
        self.keys = keys
        self.values = values


class GlobalStatsGraph:
    def __init__(self, name: str, datasets: List[GlobalStatsGraphDataset]):
        self.name = name
        self.data = [dataset.__dict__ for dataset in datasets]

    @staticmethod
    def create() -> List['GlobalStatsGraph']:
        r = current_app.config['r']
        return json.loads(r.get('global_distributions'))

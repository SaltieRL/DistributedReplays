import json
import logging
from typing import List

import redis
from flask import current_app
from sqlalchemy import func, cast, Numeric

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.database.objects import PlayerGame, Game

logger = logging.getLogger(__name__)


class GlobalStatsMetadata:
    def __init__(self, name: str, field: str):
        self.name = name
        self.field = field


global_stats_metadatas = [
    GlobalStatsMetadata('Score', 'score'),
    GlobalStatsMetadata('Goals', 'goals'),
    GlobalStatsMetadata('Assists', 'assists'),
    GlobalStatsMetadata('Saves', 'saves'),
    GlobalStatsMetadata('Shots', 'shots'),
    GlobalStatsMetadata('Hits', 'total_hits'),
    GlobalStatsMetadata('Turnovers', 'turnovers'),
    GlobalStatsMetadata('Passes', 'total_passes'),
    GlobalStatsMetadata('Dribbles', 'total_dribbles'),
    GlobalStatsMetadata('Assists per Hit', 'assistsph'),
    GlobalStatsMetadata('Shots per Hit', 'shotsph'),
    GlobalStatsMetadata('Turnovers per Hit', 'turnoversph'),
    GlobalStatsMetadata('Saves per Hit', 'savesph'),
    GlobalStatsMetadata('Dribbles per Hit', 'total_dribblesph')
]


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
        session = current_app.config['db']()
        try:
            r = current_app.config['r']
            try:
                cache = r.get('stats_cache')
                if cache is not None:
                    return json.loads(cache)
            except redis.exceptions.ConnectionError as e:
                logger.error(e)
                raise CalculatedError(500, 'Could not connect to cache.')
        except KeyError:
            pass

        overall_data = []
        numbers = []
        game_modes = range(1, 5)

        for game_mode in game_modes:
            numbers.append(
                session.query(func.count(PlayerGame.id)).join(Game).filter(Game.teamsize == (game_mode)).scalar())

        for global_stats_metadata in global_stats_metadatas:
            stats_field = global_stats_metadata.field
            per_hit_name_suffix = 'ph'
            if stats_field.endswith(per_hit_name_suffix):
                _query = session.query(
                    func.round(
                        cast(getattr(PlayerGame, stats_field.replace(per_hit_name_suffix, '')),
                             Numeric) / PlayerGame.total_hits, 2).label('n'),
                    func.count(PlayerGame.id)).filter(PlayerGame.total_hits > 0).group_by('n').order_by('n')
            else:
                _query = session.query(getattr(PlayerGame, stats_field), func.count(PlayerGame.id)).group_by(
                    getattr(PlayerGame, stats_field)).order_by(getattr(PlayerGame, stats_field))

            datasets = []
            if stats_field == 'score':
                _query = _query.filter(PlayerGame.score % 10 == 0)
            for i, game_mode in enumerate(game_modes):
                # print(g)
                data_query = _query.join(Game).filter(Game.teamsize == game_mode).all()
                datasets.append({
                    'name': f"{game_mode}'s",
                    'keys': [],
                    'values': []
                })
                for k, v in data_query:
                    if k is not None:
                        datasets[-1]['keys'].append(float(k))
                        datasets[-1]['values'].append(float(v) / float(numbers[i]))
            overall_data.append(GlobalStatsGraph(
                name=global_stats_metadata.name,
                datasets=[GlobalStatsGraphDataset(**dataset) for dataset in datasets]
            ))

        session.close()
        return overall_data

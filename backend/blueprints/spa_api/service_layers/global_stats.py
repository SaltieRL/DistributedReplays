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


class GlobalStatsGraphData:
    def __init__(self, keys: List[float], values: List[float]):
        self.keys = keys
        self.values = values


class GlobalStatsGraph:
    def __init__(self, name: str,
                 _1: GlobalStatsGraphData, _2: GlobalStatsGraphData,
                 _3: GlobalStatsGraphData, _4: GlobalStatsGraphData):
        self.name = name
        self._1 = _1.__dict__
        self._2 = _2.__dict__
        self._3 = _3.__dict__
        self._4 = _4.__dict__

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
                session.query(func.count(PlayerGame.id)).join(Game).filter(Game.teamsize == (game_mode + 1)).scalar())

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

            data = {}
            if stats_field == 'score':
                _query = _query.filter(PlayerGame.score % 10 == 0)
            for game_mode in game_modes:
                # print(g)
                data_query = _query.join(Game).filter(Game.teamsize == game_mode).all()
                data[game_mode] = {
                    'keys': [],
                    'values': []
                }
                for k, v in data_query:
                    if k is not None:
                        data[game_mode]['keys'].append(float(k))
                        data[game_mode]['values'].append(float(v) / max(float(numbers[game_mode - 1]), 1))
            overall_data.append(GlobalStatsGraph(
                name=global_stats_metadata.name,
                _1=GlobalStatsGraphData(**data[1]),
                _2=GlobalStatsGraphData(**data[2]),
                _3=GlobalStatsGraphData(**data[3]),
                _4=GlobalStatsGraphData(**data[4])
            ))

        return overall_data

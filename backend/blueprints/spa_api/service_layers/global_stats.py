import json
import logging

import redis
from flask import current_app
from sqlalchemy import func, cast, Numeric

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.database.objects import PlayerGame, Game

logger = logging.getLogger(__name__)


class GlobalStatsGraph:
    def __init__(self, name: str, field: str):
        self.name = name
        self.field = field


global_stats_graphs = [
    GlobalStatsGraph('Score', 'score'),
    GlobalStatsGraph('Goals', 'goals'),
    GlobalStatsGraph('Assists', 'assists'),
    GlobalStatsGraph('Saves', 'saves'),
    GlobalStatsGraph('Shots', 'shots'),
    GlobalStatsGraph('Hits', 'total_hits'),
    GlobalStatsGraph('Turnovers', 'turnovers'),
    GlobalStatsGraph('Passes', 'total_passes'),
    GlobalStatsGraph('Dribbles', 'total_dribbles'),
    GlobalStatsGraph('Assists per Hit', 'assistsph'),
    GlobalStatsGraph('Shots per Hit', 'shotsph'),
    GlobalStatsGraph('Turnovers per Hit', 'turnoversph'),
    GlobalStatsGraph('Saves per Hit', 'savesph'),
    GlobalStatsGraph('Dribbles per Hit', 'total_dribblesph')
]


class GlobalStats:
    @staticmethod
    def create():
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

        overall_data = {}
        numbers = []
        game_modes = range(1, 5)

        for game_mode in game_modes:
            numbers.append(
                session.query(func.count(PlayerGame.id)).join(Game).filter(Game.teamsize == (game_mode + 1)).scalar())

        for global_stats_graph in global_stats_graphs:
            stats_field = global_stats_graph.field
            if stats_field.endswith('ph'):
                _query = session.query(
                    func.round(
                        cast(getattr(PlayerGame, stats_field.replace('ph', '')),
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
            overall_data[stats_field] = data

        return overall_data

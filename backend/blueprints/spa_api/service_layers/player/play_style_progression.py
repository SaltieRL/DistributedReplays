import datetime
from typing import List

from flask import current_app

from backend.blueprints.spa_api.errors.errors import UserHasNoReplays
from backend.blueprints.spa_api.service_layers.stat import ProgressionDataPoint, DataPoint
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.wrapper.stats.player_stat_wrapper import TimeUnit
from .player_profile_stats import player_stat_wrapper, player_wrapper


class PlayStyleProgressionDataPoint(ProgressionDataPoint):
    pass


class PlayStyleProgression:
    @staticmethod
    @with_session
    def create_progression(id_: str,
                           time_unit: TimeUnit = None,
                           start_date: datetime.datetime = None,
                           end_date: datetime.datetime = None,
                           playlist: int = None,
                           session=None) -> List['PlayStyleProgressionDataPoint']:
        game_count = player_wrapper.get_total_games(session, id_)
        if game_count == 0:
            raise UserHasNoReplays()
        data = player_stat_wrapper.get_progression_stats(session, id_, time_unit=time_unit, start_date=start_date,
                                                         end_date=end_date, playlist=playlist)

        return [
            PlayStyleProgressionDataPoint(
                date=data_point_info['name'],
                data_points=[
                    DataPoint(name=name,
                              average=data_point_info['average'][name],
                              std_dev=data_point_info['std_dev'][name])
                    for name in data_point_info['average']
                ],
                count=data_point_info['count']
            )
            for data_point_info in data
        ]

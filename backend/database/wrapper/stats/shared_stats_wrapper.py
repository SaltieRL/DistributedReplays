import logging

import sqlalchemy
from carball.generated.api import player_pb2

from backend.database.objects import PlayerGame
from backend.database.utils.dynamic_field_manager import create_and_filter_proto_field, add_dynamic_fields
from backend.database.wrapper.stats import stat_math

from backend.database.wrapper.stats.stat_math import safe_divide
from sqlalchemy import func, cast, literal

logger = logging.getLogger(__name__)


class SharedStatsWrapper:
    """
    Contains basic stat queries initialized at creation time
    """

    def __init__(self):
        self.stats_query, self.field_names, self.std_query = self.get_stats_query()

    @staticmethod
    def get_stats_query():
        field_list = create_and_filter_proto_field(proto_message=player_pb2.Player,
                                                   blacklist_field_names=['name', 'title_id', 'is_orange', 'is_bot'],
                                                   blacklist_message_types=['api.metadata.CameraSettings',
                                                                            'api.metadata.PlayerLoadout',
                                                                            'api.PlayerId'],
                                                   db_object=PlayerGame)
        stat_list = []
        for field in field_list:
            field = getattr(PlayerGame, field.field_name)
            stat_list.append(field)

        stat_list += [
            PlayerGame.boost_usage,
            PlayerGame.average_speed,
            PlayerGame.possession_time,
            PlayerGame.total_hits - PlayerGame.total_dribble_conts,  # hits that are not dribbles
            (100 * PlayerGame.shots) /
            safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts),  # Shots per non dribble
            (100 * PlayerGame.total_passes) /
            safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts),  # passes per non dribble
            (100 * PlayerGame.assists) /
            safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts),  # assists per non dribble
            100 * (PlayerGame.shots + PlayerGame.total_passes + PlayerGame.total_saves + PlayerGame.total_goals) /
            safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts),  # useful hit per non dribble
            PlayerGame.turnovers,
            func.sum(PlayerGame.goals) / safe_divide(cast(func.sum(PlayerGame.shots), sqlalchemy.Numeric)),
            PlayerGame.total_aerials,
            PlayerGame.time_in_attacking_half,
            PlayerGame.time_in_attacking_third,
            PlayerGame.time_in_defending_half,
            PlayerGame.time_in_defending_third,
            PlayerGame.time_behind_ball,
            PlayerGame.time_in_front_ball,
            func.random(), func.random(), func.random(), func.random(),
            PlayerGame.won_turnovers,
            PlayerGame.average_hit_distance,
            PlayerGame.total_passes,
            PlayerGame.wasted_collection,
            stat_math.get_total_boost_efficiency(),
            stat_math.get_collection_boost_efficiency(),
            stat_math.get_used_boost_efficiency()
        ]

        field_list += add_dynamic_fields(['boost usage', 'speed', 'possession', 'hits',
                                          'shots/hit', 'passes/hit', 'assists/hit', 'useful/hits',
                                          'turnovers', 'shot %', 'aerials',
                                          'att 1/2', 'att 1/3', 'def 1/2', 'def 1/3', '< ball', '> ball',
                                          'luck1', 'luck2', 'luck3', 'luck4', 'won turnovers', 'avg hit dist', 'passes',
                                          'boost wasted', 'total boost efficiency', 'collection boost efficiency',
                                          'used boost efficiency'])
        avg_list = []
        std_list = []
        for i, s in enumerate(stat_list):
            if field_list[i].field_name in ['shot %']:
                std_list.append(literal(1))
                avg_list.append(s)
            elif field_list[i].field_name in ['is_keyboard']:
                std_list.append(func.count(s))
                avg_list.append(func.count(s))
            else:
                std_list.append(func.stddev_samp(s))
                avg_list.append(func.sum(s) / safe_divide(func.sum(PlayerGame.time_in_game)) * 300)
        return avg_list, field_list, std_list

    def compare_to_global(self, stats, global_stats, global_stds):
        """
        Converts the stats to being compared the global values.
        Mostly creates ratios.
        :param stats:  The stats being modified
        :param global_stats: The global stats
        :param global_stds: The global standard deviations
        :return: A list of stats that have been modified
        """
        for i, s in enumerate(stats):
            player_stat = s
            if player_stat is None:
                player_stat = 0
            else:
                player_stat = float(player_stat)
            global_stat = global_stats[i]
            global_std = global_stds[i]
            if global_stat is None or global_stat == 0:
                global_stat = 1
            else:
                global_stat = float(global_stat)
            if global_std is None or global_std == 0:
                logger.debug(self.field_names[i].field_name, 'std is 0')
                global_std = 1
            else:
                global_std = float(global_std)
            if global_std != 1 and global_std > 0:
                logger.debug(self.field_names[i].field_name, player_stat, global_stat, global_std,
                             float((player_stat - global_stat) / global_std))
                stats[i] = float((player_stat - global_stat) / global_std)
            else:
                stats[i] = float(player_stat / global_stat)
        return stats

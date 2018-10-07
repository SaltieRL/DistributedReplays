import logging
from typing import List

from carball.generated.api import player_pb2
from google.protobuf.descriptor import FieldDescriptor
from sqlalchemy import func, literal

from backend.database.objects import PlayerGame
from backend.database.utils.dynamic_field_manager import create_and_filter_proto_field, \
    DynamicFieldResult, ProtoFieldResult
from backend.database.wrapper.field_wrapper import QueryFieldWrapper, get_explanations
from backend.database.wrapper.stats import stat_math
from backend.database.wrapper.stats.stat_math import safe_divide

logger = logging.getLogger(__name__)


class SharedStatsWrapper:
    """
    Contains basic stat queries initialized at creation time
    """

    def __init__(self):
        self.dynamic_field_list = self.create_dynamic_fields()
        self.stat_explanation_list, self.stat_explanation_map = get_explanations(self.dynamic_field_list)
        self.stat_list = self.create_stats_field_list(self.dynamic_field_list, self.stat_explanation_map)
        self.stats_query, self.std_query, self.individual_query = self.get_stats_query(self.stat_list)

    @staticmethod
    def create_dynamic_fields():
        field_list = create_and_filter_proto_field(proto_message=player_pb2.Player,
                                                   blacklist_field_names=['name', 'title_id', 'is_orange', 'is_bot'],
                                                   blacklist_message_types=['api.metadata.CameraSettings',
                                                                            'api.metadata.PlayerLoadout',
                                                                            'api.PlayerId'],
                                                   db_object=PlayerGame)
        return field_list

    @staticmethod
    def create_stats_field_list(field_list, explanation_map):
        stat_list = []
        for dynamic_field in field_list:
            query_field = getattr(PlayerGame, dynamic_field.field_name)
            stat_list.append(QueryFieldWrapper(query_field, dynamic_field=dynamic_field))

        stat_list += [
            QueryFieldWrapper(stat_math.get_hits_non_dribbles(), DynamicFieldResult('hits')),
            QueryFieldWrapper(stat_math.get_shots_per_non_dribble(), DynamicFieldResult('shots/hit'), is_percent=True),
            QueryFieldWrapper(stat_math.get_passes_per_non_dribble(), DynamicFieldResult('passes/hit'),
                              is_percent=True),
            QueryFieldWrapper(stat_math.get_assists_per_non_dribble(), DynamicFieldResult('assists/hit'),
                              is_percent=True),
            QueryFieldWrapper(stat_math.get_useful_hit_per_non_dribble(), DynamicFieldResult('useful/hits'),
                              is_percent=True),
            QueryFieldWrapper(stat_math.get_shot_percent(),
                              DynamicFieldResult('shot %'), is_percent=True, is_cumulative=True),
            QueryFieldWrapper(PlayerGame.time_in_attacking_half, DynamicFieldResult('att 1/2')),
            QueryFieldWrapper(PlayerGame.time_in_attacking_third, DynamicFieldResult('att 1/3')),
            QueryFieldWrapper(PlayerGame.time_in_defending_half, DynamicFieldResult('def 1/2')),
            QueryFieldWrapper(PlayerGame.time_in_defending_third, DynamicFieldResult('def 1/3')),
            QueryFieldWrapper(PlayerGame.time_behind_ball, DynamicFieldResult('< ball')),
            QueryFieldWrapper(PlayerGame.time_in_front_ball, DynamicFieldResult('> ball')),
            QueryFieldWrapper(func.random(), DynamicFieldResult('luck')),
            QueryFieldWrapper(stat_math.get_total_boost_efficiency(),
                              DynamicFieldResult('raw total boost efficiency'), is_percent=True),
            QueryFieldWrapper(stat_math.get_collection_boost_efficiency(),
                              DynamicFieldResult('collection boost efficiency'), is_percent=True),
            QueryFieldWrapper(stat_math.get_used_boost_efficiency(),
                              DynamicFieldResult('used boost efficiency'), is_percent=True),
            QueryFieldWrapper(stat_math.get_total_boost_efficiency(),
                              DynamicFieldResult('total boost efficiency'), is_percent=True),
            QueryFieldWrapper(stat_math.get_negative_turnover_per_non_dribble(),
                              DynamicFieldResult('turnover efficiency'), is_percent=True),
            QueryFieldWrapper(stat_math.get_boost_ratio(),
                              DynamicFieldResult('boost ratio'), is_percent=True),
            QueryFieldWrapper(stat_math.get_aerial_efficiency(),
                              DynamicFieldResult('aerial_efficiency'), is_percent=True),

        ]
        SharedStatsWrapper.assign_values(stat_list, explanation_map)
        return stat_list

    @staticmethod
    def assign_values(stat_list: List[QueryFieldWrapper], explanation_map):
        for stat in stat_list:
            if isinstance(stat.dynamic_field, ProtoFieldResult):
                if stat.dynamic_field.field_descriptor.type == FieldDescriptor.TYPE_BOOL:
                    stat.is_boolean = True
            if 'average' in stat.get_query_key():
                stat.is_averaged = True
            if stat.get_query_key() in explanation_map:
                stat.explanation = explanation_map[stat.get_query_key()]

    @staticmethod
    def get_stats_query(stat_list: List[QueryFieldWrapper]):
        avg_list = []
        std_list = []
        individual_list = []
        for stat in stat_list:
            if stat.is_cumulative:
                std_list.append(literal(1))
                avg_list.append(stat.query)
                individual_list.append(stat.query)
            elif stat.is_averaged or stat.is_percent:
                std_list.append(func.stddev_samp(stat.query))
                avg_list.append(func.avg(stat.query))
                individual_list.append(func.sum(stat.query))
            elif stat.is_boolean:
                std_list.append(literal(1))
                avg_list.append(func.count())
                individual_list.append(func.bool_and(stat.query))
            else:
                std_list.append(func.stddev_samp(stat.query))
                avg_list.append(
                    300 * func.sum(stat.query) / safe_divide(func.sum(PlayerGame.time_in_game), default=300))
                individual_list.append(func.sum(stat.query))
        return avg_list, std_list, individual_list

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
                logger.debug("%s %s", self.stat_list[i].dynamic_field.field_name, 'std is 0')
                global_std = 1
            else:
                global_std = float(global_std)
            if global_std != 1 and global_std > 0:
                if str(self.stat_list[i].dynamic_field.field_name) == 'time_behind_ball':
                    logger.debug("%s %s %s %s %s", str(self.stat_list[i].dynamic_field.field_name), str(player_stat),
                                 str(global_stat), str(global_std),
                                 str(float((player_stat - global_stat) / global_std)))
                stats[i] = float((player_stat - global_stat) / global_std)
            else:
                stats[i] = float(player_stat / global_stat)
        return stats

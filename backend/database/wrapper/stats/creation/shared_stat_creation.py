from typing import List

from google.protobuf.descriptor import FieldDescriptor
from sqlalchemy import literal, func

from backend.database.objects import PlayerGame
from backend.database.utils.dynamic_field_manager import ProtoFieldResult
from backend.database.wrapper.field_wrapper import QueryFieldWrapper
from backend.database.wrapper.stats.stat_math import safe_divide


class SharedStatCreation:

    def __init__(self):
        self.dynamic_field_list = None
        self.stat_explanation_list = None
        self.stat_explanation_map = None
        self.stat_list = None
        self.stats_query = None
        self.std_query = None
        self.individual_query = None

    @staticmethod
    def create_stats_field_list(field_list, explanation_map, database_object, math_list=None) -> List[QueryFieldWrapper]:
        stat_list = []
        for dynamic_field in field_list:
            query_field = getattr(database_object, dynamic_field.field_name)
            stat_list.append(QueryFieldWrapper(query_field, dynamic_field=dynamic_field))

        if math_list is not None:
            stat_list += math_list

        SharedStatCreation.assign_values(stat_list, explanation_map)
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

    @staticmethod
    def get_wrapped_stats(stats, stat_list):
        zipped_stats = dict()

        for i in range(len(stat_list)):
            zipped_stats[stat_list[i].get_field_name()] = stats[i]

        return zipped_stats

    def get_stat_list(self):
        return self.stat_list

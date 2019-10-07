from typing import List

from carball.generated.api import player_pb2

from backend.database.objects import PlayerGame
from backend.database.utils.dynamic_field_manager import DynamicFieldResult, ProtoFieldResult, \
    create_and_filter_proto_field
from backend.database.wrapper.field_wrapper import QueryFieldWrapper, get_explanations
from backend.database.wrapper.stats import stat_math
from backend.database.wrapper.stats.creation.shared_stat_creation import SharedStatCreation


class PlayerStatCreation(SharedStatCreation):

    def __init__(self):
        super().__init__()
        self.dynamic_field_list = self.create_dynamic_fields()
        self.stat_explanation_list, self.stat_explanation_map = get_explanations(self.dynamic_field_list)
        custom = []
        custom_stats = ['rank', 'mmr']
        for stat in custom_stats:
            query_field = getattr(PlayerGame, stat)
            qstat = QueryFieldWrapper(query_field, dynamic_field=DynamicFieldResult(stat))
            qstat.is_averaged = True
            custom.append(qstat)
        self.stat_list = self.create_stats_field_list(self.dynamic_field_list, self.stat_explanation_map,
                                                      PlayerGame,
                                                      math_list=self.get_math_queries(), custom=custom)
        self.stats_query, self.std_query, self.individual_query = self.get_stats_query(self.stat_list)

    @staticmethod
    def create_dynamic_fields() -> List[ProtoFieldResult]:
        field_list = create_and_filter_proto_field(proto_message=player_pb2.Player,
                                                   blacklist_field_names=['name', 'title_id', 'is_orange', 'is_bot'],
                                                   blacklist_message_types=['api.metadata.CameraSettings',
                                                                            'api.metadata.PlayerLoadout',
                                                                            'api.PlayerId'],
                                                   db_object=PlayerGame)
        return field_list

    @staticmethod
    def get_math_queries() -> List[QueryFieldWrapper]:
        return [
            QueryFieldWrapper(stat_math.get_shots_per_non_dribble(), DynamicFieldResult('shots/hit'), is_percent=True),
            QueryFieldWrapper(stat_math.get_passes_per_non_dribble(), DynamicFieldResult('passes/hit'),
                              is_percent=True),
            QueryFieldWrapper(stat_math.get_assists_per_non_dribble(), DynamicFieldResult('assists/hit'),
                              is_percent=True),
            QueryFieldWrapper(stat_math.get_useful_hit_per_non_dribble(), DynamicFieldResult('useful/hits'),
                              is_percent=True),
            QueryFieldWrapper(stat_math.get_shot_percent(),
                              DynamicFieldResult('shot_%'), is_percent=True, is_cumulative=True),
            QueryFieldWrapper(stat_math.get_collection_boost_efficiency(),
                              DynamicFieldResult('collection_boost_efficiency'), is_percent=True),
            QueryFieldWrapper(stat_math.get_used_boost_efficiency(),
                              DynamicFieldResult('used_boost_efficiency'), is_percent=True),
            QueryFieldWrapper(stat_math.get_total_boost_efficiency(),
                              DynamicFieldResult('total_boost_efficiency'), is_percent=True),
            QueryFieldWrapper(stat_math.get_negative_turnover_per_non_dribble(),
                              DynamicFieldResult('turnover_efficiency'), is_percent=True),
            QueryFieldWrapper(stat_math.get_boost_ratio(),
                              DynamicFieldResult('boost_ratio'), is_percent=True),
            QueryFieldWrapper(stat_math.get_aerial_efficiency(),
                              DynamicFieldResult('aerial_efficiency'), is_percent=True),

        ]

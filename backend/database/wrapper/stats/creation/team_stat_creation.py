from typing import List

from carball.generated.api.stats import team_stats_pb2

from backend.database.objects import TeamStat
from backend.database.utils.dynamic_field_manager import ProtoFieldResult, create_and_filter_proto_field
from backend.database.wrapper.field_wrapper import get_explanations
from backend.database.wrapper.stats.creation.shared_stat_creation import SharedStatCreation


class TeamStatCreation(SharedStatCreation):

    def __init__(self):
        super().__init__()
        self.dynamic_field_list = self.create_dynamic_fields()
        self.stat_explanation_list, self.stat_explanation_map = get_explanations(self.dynamic_field_list)
        self.stat_list = self.create_stats_field_list(self.dynamic_field_list, self.stat_explanation_map, TeamStat)
        self.stats_query, self.std_query, self.individual_query = self.get_stats_query(self.stat_list)

    @staticmethod
    def create_dynamic_fields() -> List[ProtoFieldResult]:
        field_list = create_and_filter_proto_field(proto_message=team_stats_pb2.TeamStats,
                                                   blacklist_field_names=[],
                                                   blacklist_message_types=[],
                                                   db_object=TeamStat)
        return field_list

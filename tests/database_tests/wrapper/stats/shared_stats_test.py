import unittest
from typing import List

from backend.database.wrapper.field_wrapper import QueryFieldWrapper
from backend.database.wrapper.stats.creation.player_stat_creation import PlayerStatCreation
from backend.database.wrapper.stats.creation.team_stat_creation import TeamStatCreation
from backend.database.wrapper.stats.shared_stats_wrapper import SharedStatsWrapper


class SharedStatsTest(unittest.TestCase):
    def setUp(self):
        self.player_stats = PlayerStatCreation()
        self.team_stats = TeamStatCreation()

    def test_create_stats_field(self):
        player_stats = self.player_stats.get_math_queries()
        team_stats = self.team_stats.get_stat_list()
        print(player_stats)

    def test_has_explanations(self):
        stat_list: List[QueryFieldWrapper] = self.player_stats.get_stat_list()
        self.assertTrue(all([stat.explanation is not None for stat in stat_list]),
                        msg="The following stats do not have explanations: {}".format(
                            str([stat.dynamic_field.field_name for stat in stat_list if stat.explanation is None])))

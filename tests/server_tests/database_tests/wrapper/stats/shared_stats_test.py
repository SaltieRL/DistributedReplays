import unittest
from typing import List

from backend.database.wrapper.chart.player_chart_metadata import player_stats_metadata
from backend.database.wrapper.field_wrapper import QueryFieldWrapper
from backend.database.wrapper.stats.creation.player_stat_creation import PlayerStatCreation
from backend.database.wrapper.stats.creation.team_stat_creation import TeamStatCreation


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

    def test_player_charts(self):
        # test for duplicates
        stat_names: List[str] = [p.stat_name for p in player_stats_metadata]
        self.assertTrue(len(stat_names) == len(set(stat_names)),
                        msg="There are duplicate stat names in stat metadata list.")

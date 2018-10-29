import unittest

from backend.database.wrapper.stats.creation.player_stat_creation import PlayerStatCreation
from backend.database.wrapper.stats.creation.team_stat_creation import TeamStatCreation
from backend.database.wrapper.stats.shared_stats_wrapper import SharedStatsWrapper


class SharedStatsTest(unittest.TestCase):
    def test_create_stats_field(self):
        player_stats = PlayerStatCreation().get_math_queries()
        team_stats = TeamStatCreation().get_stat_list()
        print(player_stats)

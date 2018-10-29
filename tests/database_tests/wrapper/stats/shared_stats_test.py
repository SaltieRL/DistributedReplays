from _pytest import unittest

from backend.database.wrapper.stats.shared_stats_wrapper import SharedStatsWrapper


class SharedStatsTest(unittest.UnitTestCase):
    def test_create_stats_field(self):
        stats = SharedStatsWrapper.create_stats_field_list()
        print(stats)

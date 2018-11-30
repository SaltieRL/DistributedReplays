import logging
from typing import List

from backend.database.wrapper.field_wrapper import QueryFieldWrapper
from backend.database.wrapper.stats.creation.player_stat_creation import PlayerStatCreation
from backend.database.wrapper.stats.creation.shared_stat_creation import SharedStatCreation
from backend.database.wrapper.stats.creation.team_stat_creation import TeamStatCreation

logger = logging.getLogger(__name__)


class SharedStatsWrapper:
    """
    Contains basic stat queries initialized at creation time
    """

    def __init__(self):
        self.player_stats = PlayerStatCreation()
        self.team_stats = TeamStatCreation()

    def compare_to_global(self, stats, global_stats, global_stds):
        """
        Converts the stats to being compared the global values.
        Mostly creates ratios.
        :param stats:  The stats being modified
        :param global_stats: The global stats
        :param global_stds: The global standard deviations
        :return: A list of stats that have been modified
        """
        stat_list = self.get_player_stat_list()
        print("Global stats", global_stats)
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
                logger.debug("%s %s", stat_list[i].dynamic_field.field_name, 'std is 0')
                global_std = 1
            else:
                global_std = float(global_std)
            if global_std != 1 and global_std > 0:
                if str(stat_list[i].dynamic_field.field_name) == 'time_behind_ball':
                    logger.debug("%s %s %s %s %s", str(stat_list[i].dynamic_field.field_name), str(player_stat),
                                 str(global_stat), str(global_std),
                                 str(float((player_stat - global_stat) / global_std)))
                stats[i] = float((player_stat - global_stat) / global_std)
            else:
                stats[i] = float(player_stat / global_stat)
        return stats

    def get_player_stat_list(self) -> List[QueryFieldWrapper]:
        return self.player_stats.stat_list

    def get_player_stat_query(self):
        return self.player_stats.stats_query

    def get_wrapped_stats(self, stats, creation: SharedStatCreation):
        return SharedStatCreation.get_wrapped_stats(stats, creation.get_stat_list())

    def get_player_stat_std_query(self):
        return self.player_stats.std_query

    def float_maybe(self, f):
        if f is None:
            return None
        else:
            return float(f)

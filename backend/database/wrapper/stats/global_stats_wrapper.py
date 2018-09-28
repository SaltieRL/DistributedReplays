import datetime
import logging
import json
from sqlalchemy import func
from sqlalchemy.dialects import postgresql

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.database.objects import PlayerGame, Game
from backend.database.wrapper.query_filter_builder import QueryFilterBuilder
from backend.database.wrapper.rank_wrapper import get_rank_number
from backend.database.wrapper.stats.shared_stats_wrapper import SharedStatsWrapper
from backend.utils.checks import get_local_dev

logger = logging.getLogger(__name__)


class GlobalStatWrapper(SharedStatsWrapper):
    """
    A database wrapper for global stats.  Acts additionally on global stats in addition to player stats
    """

    def __init__(self):
        super().__init__()

        # this Object needs to be pooled per a session so only one is used at a time
        self.base_query = QueryFilterBuilder().with_relative_start_time(days_ago=self.get_timeframe()).with_team_size(
            3).sticky()

    def get_global_stats(self, sess):
        """
        :return: A list of stats by rank for every field.
        """
        results = {}
        ranks = list(range(20))

        def float_maybe(f):
            if f is None:
                return None
            else:
                return float(f)

        for column, q in zip(self.field_names, self.stats_query):
            column_results = []
            # set the column result
            self.base_query.clean().with_stat_query([PlayerGame.player, q.label('avg')])
            for rank in ranks:
                query = self.base_query.with_rank(rank).build_query(sess)
                query = query.group_by(PlayerGame.player).having(func.count(PlayerGame.player) > 5).subquery()

                result = sess.query(func.avg(query.c.avg), func.stddev_samp(query.c.avg)).first()
                column_results.append({'mean': float_maybe(result[0]), 'std': float_maybe(result[1])})
            results[column.field_name] = column_results
        return results

    def get_global_stats_by_rank(self, session, query_filter: QueryFilterBuilder, stats_query, stds_query,
                                 player_rank=None, redis=None, ids=None):
        """
        Returns the global stats based on the rank of a player.

        Does modify the query_filter only setting rank.
        :param session: Session
        :param query_filter: a query filter.
        :param stats_query: A list of global stats
        :param stds_query: A list of global stats for standard deviations
        :param player_rank: The player that stats are associated with.  Uses unranked if rank is not found
        :param redis: The local cache
        :return:
        """

        if ids is None:
            # Set the correct rank index
            if player_rank is not None:
                if isinstance(player_rank, list):
                    rank_index = get_rank_number(player_rank)
                else:
                    rank_index = player_rank
            else:
                rank_index = 0

            # Check to see if we have redis available (it usually is)
            if redis is not None:
                stat_string = redis.get('global_stats')
                # Check to see if the key exists and if so load it
                if stat_string is not None:
                    stats_dict = json.loads(stat_string)
                    global_stats = [stats_dict[s.field_name][rank_index]['mean'] for s in self.field_names]
                    global_stds = [stats_dict[s.field_name][rank_index]['std'] for s in self.field_names]
                    return global_stats, global_stds
            if get_local_dev():
                stats = self.get_global_stats(session)
                global_stats = [stats[s.field_name][rank_index]['mean'] for s in self.field_names]
                global_stds = [stats[s.field_name][rank_index]['std'] for s in self.field_names]
                return global_stats, global_stds
            raise CalculatedError(500, "Global stats unavailable or have not been calculated yet.")
        else:
            query_filter.clean().with_replay_ids(ids)
            return (query_filter.with_stat_query(stats_query).build_query(session).first(),
                    query_filter.with_stat_query(stds_query).build_query(session).first())

    @staticmethod
    def get_timeframe():
        """Returns the number of days we accept old stats"""
        try:
            from flask import current_app
            return current_app.config['STAT_DAY_LIMIT']
        except:
            return 30 * 6


if __name__ == '__main__':
    from backend.database.startup import startup

    engine, Session = startup()
    sess = Session()
    try:
        result = GlobalStatWrapper().get_global_stats(sess)
        print(result)
    except KeyboardInterrupt:
        sess.close()
    finally:  # result = engine.execute()
        sess.close()

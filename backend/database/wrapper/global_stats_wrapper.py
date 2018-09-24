from sqlalchemy import func

from backend.database.objects import PlayerGame
from backend.database.wrapper.player_stat_wrapper import PlayerStatWrapper
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.query_filter_builder import QueryFilterBuilder


class GlobalStatWrapper(PlayerStatWrapper):
    """
    A database wrapper for global stats.  Acts additionally on global stats in addition to player stats
    """

    def __init__(self, player_wrapper: PlayerWrapper):
        PlayerStatWrapper.__init__(self, player_wrapper)
        self.base_query = QueryFilterBuilder().with_relative_start_time(days_ago=self.get_timeframe()).sticky()

    def get_timeframe(self):
        """Returns the number of days we accept old stats"""
        try:
            from flask import current_app
            return current_app.config['STAT_DAY_LIMIT']
        except:
            return 30 * 6

    def get_global_stats(self, sess):
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
            self.base_query.clean().with_stat_query([PlayerGame.player,
                                                     q.label('avg')])
            for rank in ranks:
                query = self.base_query.with_rank(rank).build_query(sess)
                query = query.group_by(PlayerGame.player).having(func.count(PlayerGame.player) > 5).subquery()

                result = sess.query(func.avg(query.c.avg), func.stddev_samp(query.c.avg)).first()
                column_results.append({'mean': float_maybe(result[0]), 'std': float_maybe(result[1])})
            results[column.field_name] = column_results
        return results

import json
import logging
import sys
import os

from sqlalchemy import func

path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
print(path)
sys.path.append(path)

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.database.objects import PlayerGame, Game, Playlist
from backend.database.wrapper.query_filter_builder import QueryFilterBuilder
from backend.database.wrapper.rank_wrapper import get_rank_tier
from backend.database.wrapper.stats.shared_stats_wrapper import SharedStatsWrapper
from backend.utils.checks import ignore_filtering, is_local_dev

logger = logging.getLogger(__name__)

GLOBAL_STATS_PLAYLISTS = [Playlist.UNRANKED_DUELS,
                          Playlist.UNRANKED_DOUBLES,
                          Playlist.UNRANKED_STANDARD,
                          Playlist.UNRANKED_CHAOS,
                          Playlist.RANKED_DUELS,
                          Playlist.RANKED_DOUBLES,
                          Playlist.RANKED_SOLO_STANDARD,
                          Playlist.RANKED_STANDARD,
                          Playlist.RANKED_DROPSHOT,
                          Playlist.RANKED_HOOPS,
                          Playlist.RANKED_RUMBLE,
                          Playlist.RANKED_SNOW_DAY]
GLOBAL_STATS_PLAYLISTS = [int(p.value) for p in GLOBAL_STATS_PLAYLISTS]


class GlobalStatWrapper(SharedStatsWrapper):
    """
    A database wrapper for global stats.  Acts additionally on global stats in addition to player stats
    """

    def __init__(self):
        super().__init__()

        # this Object needs to be pooled per a session so only one is used at a time
        self.base_query = QueryFilterBuilder().with_relative_start_time(
            days_ago=self.get_timeframe()).with_safe_checking().sticky()

    def get_global_stats(self, sess, with_rank=True):
        """
        :return: A list of stats by rank for every field.
        """
        if with_rank:
            ranks = list(range(20))
        else:
            ranks = [0]


        playlist_results = {}
        for playlist in GLOBAL_STATS_PLAYLISTS:
            results = {}
            for column, q in zip(self.get_player_stat_list(), self.get_player_stat_query()):
                column_results = []
                # set the column result
                self.base_query.clean().with_stat_query([PlayerGame.player, q.label('avg')])
                for rank in ranks:
                    result = self._get_global_stats_result(self.base_query, playlist, rank, sess, with_rank=with_rank)
                    column_results.append({'mean': self.float_maybe(result[0]), 'std': self.float_maybe(result[1])})
                results[column.get_field_name()] = column_results
            playlist_results[playlist] = results
        return playlist_results

    def _get_global_stats_result(self, query, playlist, rank, session, with_rank=True):
        if with_rank:
            query = query.with_rank(rank)
        if not ignore_filtering():
            query.with_playlists([playlist])
        query = query.build_query(session)
        query = query.group_by(PlayerGame.player)
        if ignore_filtering():
            query = query.subquery()
        else:
            query = query.filter(PlayerGame.game != "").filter(PlayerGame.time_in_game > 0).having(
                func.count(PlayerGame.player) > 5).subquery()

        return session.query(func.avg(query.c.avg), func.stddev_samp(query.c.avg)).first()

    def get_global_stats_by_rank(self, session, query_filter: QueryFilterBuilder, stats_query, stds_query,
                                 player_rank=None, redis=None, ids=None, playlist=13):
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
                if isinstance(player_rank, dict) or isinstance(player_rank, list):
                    rank_index = get_rank_tier(player_rank, playlist=playlist)
                else:
                    rank_index = player_rank
            else:
                rank_index = 0

            stat_list = self.get_player_stat_list()

            # Check to see if we have redis available (it usually is)
            if redis is not None:
                stat_string = redis.get('global_stats')
                # Check to see if the key exists and if so load it
                if stat_string is not None:
                    stats_dict = json.loads(stat_string)
                    if playlist is not None:
                        playlist = str(playlist)
                    if playlist not in stats_dict:
                        raise CalculatedError(404, 'Playlist does not exist in global stats')
                    stats_dict = stats_dict[playlist]
                    global_stats = []
                    global_stds = []
                    for stat in stat_list:
                        if stat.get_field_name() in stats_dict:
                            global_stats.append(stats_dict[stat.get_field_name()][rank_index]['mean'])
                            global_stds.append(stats_dict[stat.get_field_name()][rank_index]['std'])
                        else:
                            global_stats.append(1)
                            global_stds.append(1)
                    return global_stats, global_stds
            if is_local_dev():
                rank_index = 0
                stats = self.get_global_stats(session, with_rank=False)
                global_stats = [stats[stat.get_field_name()][rank_index]['mean'] for stat in stat_list]
                global_stds = [stats[stat.get_field_name()][rank_index]['std'] for stat in stat_list]
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

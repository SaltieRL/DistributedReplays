import datetime
import json
import logging

import sqlalchemy
from carball.generated.api import player_pb2
from sqlalchemy import func, cast, literal, and_

from backend.database.objects import PlayerGame, Game
from backend.database.utils.dynamic_field_manager import create_and_filter_proto_field, add_dynamic_fields
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.rank_wrapper import get_rank_number
from backend.utils.checks import get_local_dev

logger = logging.getLogger(__name__)


def safe_divide(sql_value):
    return func.greatest(sql_value, 1)


class PlayerStatWrapper:

    def __init__(self, player_wrapper: PlayerWrapper):
        self.stats_query, self.field_names, self.std_query = self.get_stats_query()
        self.player_wrapper = player_wrapper

    def get_wrapped_stats(self, stats):
        zipped_stats = dict()

        for i in range(len(self.field_names)):
            zipped_stats[self.field_names[i].field_name] = stats[i]

        return zipped_stats

    def get_global_stats_by_rank(self, session, stats_filter: QueryFilterBuilder, stds_filter: QueryFilterBuilder,
                                 player_rank=None, redis=None):
        """
        Returns the global stats based on the rank of a player
        :param session: Session
        :param stats_filter: a query filter for the stats.
        :param stds_filter: A query filter for standard derivative
        :param player_rank: The player that stats are associated with.  Uses unranked if rank is not found
        :param redis: The local cache
        :return:
        """
        rank_index = get_rank_number(player_rank)
        if redis is not None:
            stat_string = redis.get('global_stats')
            if stat_string is not None:
                stats_dict = json.loads(stat_string)
                global_stats = [stats_dict[s.field_name][rank_index]['mean'] for s in self.field_names]
                global_stds = [stats_dict[s.field_name][rank_index]['std'] for s in self.field_names]
                return global_stats, global_stds

        if player_rank is not None and not get_local_dev():
            logger.debug('Filtering by rank')
            global_stats = stats_filter.clean().with_rank(rank_index)
            global_stds = stds_filter.clean().with_rank(rank_index)
        else:
            global_stats = stats_filter.clean()
            global_stds = stds_filter.clean()

        return global_stats.build_query(session).first(), global_stds.build_query(session).first()

    def get_stats(self, session, id_, stats_query, std_query, rank=None, redis=None):
        global_stats = None
        global_stds = None

        ago = datetime.datetime.now() - datetime.timedelta(days=30 * 6)  # 6 months in the past
        q = session.query(*stats_query).join(Game).filter(PlayerGame.total_hits > 0).filter(Game.teamsize == 3).filter(
            Game.match_date > ago)  # TODO: convert this madness into a reusable function
        stds = session.query(*std_query).join(Game).filter(PlayerGame.total_hits > 0).filter(Game.teamsize == 3).filter(
            Game.match_date > ago)
        stats = list(q.filter(PlayerGame.player == id_).first())
        if redis is None:


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
                logger.debug(self.field_names[i].field_name, 'std is 0')
                global_std = 1
            else:
                global_std = float(global_std)
            if global_std != 1 and global_std > 0:
                logger.debug(self.field_names[i].field_name, player_stat, global_stat, global_std,
                             float((player_stat - global_stat) / global_std))
                stats[i] = float((player_stat - global_stat) / global_std)
            else:
                stats[i] = float(player_stat / global_stat)
        return stats

    def get_averaged_stats(self, session, id_, rank=None, redis=None):
        stats_query = self.stats_query
        std_query = self.std_query
        total_games = self.player_wrapper.get_total_games(session, id_)
        if total_games > 0:
            stats = self.get_stats(session, id_, stats_query, std_query, rank=rank, redis=redis)
        else:
            stats = [0.0] * len(stats_query)
        return self.get_wrapped_stats(stats)

    @staticmethod
    def get_stats_query():
        field_list = create_and_filter_proto_field(proto_message=player_pb2.Player,
                                                   blacklist_field_names=['name', 'title_id', 'is_orange', 'is_bot'],
                                                   blacklist_message_types=['api.metadata.CameraSettings',
                                                                            'api.metadata.PlayerLoadout',
                                                                            'api.PlayerId'],
                                                   db_object=PlayerGame)
        stat_list = []
        for field in field_list:
            field = getattr(PlayerGame, field.field_name)
            stat_list.append(field)

        stat_list += [
            PlayerGame.boost_usage,
            PlayerGame.average_speed,
            PlayerGame.possession_time,
            PlayerGame.total_hits - PlayerGame.total_dribble_conts,  # hits that are not dribbles
            (100 * PlayerGame.shots) /
            safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts),  # Shots per non dribble
            (100 * PlayerGame.total_passes) /
            safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts),  # passes per non dribble
            (100 * PlayerGame.assists) /
            safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts),  # assists per non dribble
            100 * (PlayerGame.shots + PlayerGame.total_passes + PlayerGame.total_saves + PlayerGame.total_goals) /
            safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts),  # useful hit per non dribble
            PlayerGame.turnovers,
            func.sum(PlayerGame.goals) / safe_divide(cast(func.sum(PlayerGame.shots), sqlalchemy.Numeric)),
            PlayerGame.total_aerials,
            PlayerGame.time_in_attacking_half,
            PlayerGame.time_in_attacking_third,
            PlayerGame.time_in_defending_half,
            PlayerGame.time_in_defending_third,
            PlayerGame.time_behind_ball,
            PlayerGame.time_in_front_ball,
            func.random(), func.random(), func.random(), func.random(),
            PlayerGame.won_turnovers,
            PlayerGame.average_hit_distance,
            PlayerGame.total_passes,
            PlayerGame.wasted_collection,
        ]

        field_list += add_dynamic_fields(['boost usage', 'speed', 'possession', 'hits',
                                          'shots/hit', 'passes/hit', 'assists/hit', 'useful/hits',
                                          'turnovers', 'shot %', 'aerials',
                                          'att 1/2', 'att 1/3', 'def 1/2', 'def 1/3', '< ball', '> ball',
                                          'luck1', 'luck2', 'luck3', 'luck4', 'won turnovers', 'avg hit dist', 'passes',
                                          'boost wasted'])
        avg_list = []
        std_list = []
        for i, s in enumerate(stat_list):
            if field_list[i].field_name in ['shot %']:
                std_list.append(literal(1))
                avg_list.append(s)
            elif field_list[i].field_name in ['is_keyboard']:
                std_list.append(func.count(s))
                avg_list.append(func.count(s))
            else:
                std_list.append(func.stddev_samp(s))
                avg_list.append(func.avg(s))
        return avg_list, field_list, std_list

    @staticmethod
    def get_stat_spider_charts():
        titles = [  # 'Basic',
            'Aggressiveness', 'Chemistry', 'Skill', 'Tendencies', 'Luck']
        groups = [  # ['score', 'goals', 'assists', 'saves', 'turnovers'],  # basic
            ['shots', 'possession', 'hits', 'shots/hit', 'boost usage', 'speed'],  # agressive
            ['boost wasted', 'assists', 'passes/hit', 'passes', 'assists/hit'],  # chemistry
            ['turnovers', 'useful/hits', 'aerials', 'won turnovers', 'avg hit dist'],  # skill
            ['att 1/3', 'att 1/2', 'def 1/2', 'def 1/3', '< ball', '> ball']]  # ,  # tendencies
        # ['luck1', 'luck2', 'luck3', 'luck4']]  # luck

        return [{'title': title, 'group': group} for title, group in zip(titles, groups)]



    def _create_stats(self, session, query_filter=None, ids=None):
        if query_filter is not None and ids is not None:
            query_filter = and_(query_filter, PlayerGame.game.in_(ids))
        elif ids is not None:
            query_filter = PlayerGame.game.in_(ids)
        average = session.query(*self.stats_query)
        std_devs = session.query(*self.std_query)
        if query_filter is not None:
            average = average.filter(query_filter)
            std_devs = std_devs.filter(query_filter)
        average = average.first()
        std_devs = std_devs.first()

        average = {n.field_name: round(float(s), 2) for n, s in zip(self.field_names, average) if s is not None}
        std_devs = {n.field_name: round(float(s), 2) for n, s in zip(self.field_names, std_devs) if s is not None}
        return {'average': average, 'std_dev': std_devs}

    def get_group_stats(self, session, ids):
        return_obj = {}
        # Players
        player_tuples = session.query(PlayerGame.player, func.count(PlayerGame.player)).filter(
            PlayerGame.game.in_(ids)).group_by(PlayerGame.player).all()
        return_obj['playerStats'] = {}
        ensemble = []
        for player_tuple in player_tuples:
            player, count = player_tuple
            if count > 1:
                player_stats = self._create_stats(session, PlayerGame.player == player, ids=ids)
                return_obj['playerStats'][player] = player_stats
            else:
                ensemble.append(player)
        if len(ensemble) > 0:
            ensemble_stats = self._create_stats(session, PlayerGame.player.in_(ensemble), ids=ids)
            return_obj['ensembleStats'] = ensemble_stats
        # STATS
        # Global
        global_stats = self._create_stats(session, ids=ids)
        return_obj['globalStats'] = global_stats
        return return_obj

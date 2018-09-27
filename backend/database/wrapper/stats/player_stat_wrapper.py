import logging

from sqlalchemy import func, and_

from backend.database.objects import PlayerGame
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.query_filter_builder import QueryFilterBuilder
from backend.database.wrapper.stats.global_stats_wrapper import GlobalStatWrapper

logger = logging.getLogger(__name__)


class PlayerStatWrapper(GlobalStatWrapper):
    def __init__(self, player_wrapper: PlayerWrapper):
        super().__init__()
        self.player_wrapper = player_wrapper

        # this Object needs to be pooled per a session so only one is used at a time
        self.player_stats_filter = QueryFilterBuilder()
        self.player_stats_filter.with_relative_start_time(days_ago=30 * 6).with_team_size(
            3).with_safe_checking().sticky()

    def get_wrapped_stats(self, stats):
        zipped_stats = dict()

        for i in range(len(self.field_names)):
            zipped_stats[self.field_names[i].field_name] = stats[i]

        return zipped_stats

    def get_stats(self, session, id_, stats_query, std_query, rank=None, redis=None):
        global_stats, global_stds = self.get_global_stats_by_rank(session, self.player_stats_filter,
                                                                  stats_query, std_query, player_rank=rank, redis=redis)

        self.player_stats_filter.clean().with_stat_query(stats_query).with_players([id_])

        stats = list(self.player_stats_filter.build_query(session).first())

        return self.compare_to_global(stats, global_stats, global_stds)

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

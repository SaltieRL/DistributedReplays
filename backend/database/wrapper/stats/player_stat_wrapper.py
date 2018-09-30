import datetime
import logging
from typing import Tuple, List

from sqlalchemy import func

from backend.database.objects import PlayerGame, Game
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.query_filter_builder import QueryFilterBuilder
from backend.database.wrapper.stats.global_stats_wrapper import GlobalStatWrapper
from backend.utils.checks import ignore_filtering

logger = logging.getLogger(__name__)


class PlayerStatWrapper(GlobalStatWrapper):
    def __init__(self, player_wrapper: PlayerWrapper):
        super().__init__()
        self.player_wrapper = player_wrapper

        # this Object needs to be pooled per a session so only one is used at a time
        self.player_stats_filter = QueryFilterBuilder()
        if ignore_filtering():
            self.player_stats_filter.with_relative_start_time(days_ago=30 * 6).with_team_size(
            3).with_safe_checking().sticky()

    def get_wrapped_stats(self, stats):
        zipped_stats = dict()

        for i in range(len(self.field_names)):
            zipped_stats[self.field_names[i].field_name] = stats[i]

        return zipped_stats

    def get_stats(self, session, id_, stats_query, std_query, rank=None, redis=None, raw=False, replay_ids=None):
        player_stats_filter = self.player_stats_filter.clean().clone()
        global_stats, global_stds = self.get_global_stats_by_rank(session, player_stats_filter,
                                                                  stats_query, std_query, player_rank=rank, redis=redis,
                                                                  ids=replay_ids)
        player_stats_filter.clean().with_stat_query(stats_query).with_players([id_])
        if replay_ids is not None:
            player_stats_filter.with_replay_ids(replay_ids)
        query = player_stats_filter.build_query(session)
        stats = list(query.first())
        stats = [0 if s is None else s for s in stats]
        if raw:
            return [float(s) for s in stats], [float(s) for s in global_stats]
        else:
            return self.compare_to_global(stats, global_stats, global_stds), len(stats) * [0.0]

    def get_averaged_stats(self, session, id_, rank=None, redis=None, raw=False, replay_ids=None):
        stats_query = self.stats_query
        std_query = self.std_query
        total_games = self.player_wrapper.get_total_games(session, id_, replay_ids=replay_ids)
        if total_games > 0:
            stats, global_stats = self.get_stats(session, id_, stats_query, std_query, rank=rank, redis=redis, raw=raw,
                                                 replay_ids=replay_ids)
        else:
            stats = [0.0] * len(stats_query)
            global_stats = [0.0] * len(stats_query)
        return self.get_wrapped_stats(stats), self.get_wrapped_stats(global_stats)

    def get_progression_stats(self, session, id_):

        def float_maybe(f):
            if f is None:
                return None
            else:
                return float(f)

        mean_query = session.query(func.to_char(Game.match_date, 'YY-MM').label('date'),
                                   *self.stats_query).join(PlayerGame).filter(PlayerGame.player == id_).group_by(
            'date').order_by('date').all()
        std_query = session.query(func.to_char(Game.match_date, 'YY-MM').label('date'),
                                  *self.std_query).join(PlayerGame).filter(PlayerGame.player == id_).group_by(
            'date').order_by('date').all()
        mean_query = [list(q) for q in mean_query]
        std_query = [list(q) for q in std_query]
        results = []
        for q, s in zip(mean_query, std_query):
            result = {'name': datetime.datetime.strptime(q[0], '%y-%m').isoformat(),
                      'average': self.get_wrapped_stats([float_maybe(qn) for qn in q[1:]]),
                      'std_dev': self.get_wrapped_stats([float_maybe(qn) for qn in s[1:]])}
            results.append(result)
        return results

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

    def _create_stats(self, session, player_filter=None, replay_ids=None):
        average = QueryFilterBuilder().with_stat_query(self.stats_query)
        std_devs = QueryFilterBuilder().with_stat_query(self.std_query)
        if player_filter is not None:
            average.with_players(player_filter)
            std_devs.with_players(player_filter)
        if replay_ids is not None:
            average.with_replay_ids(replay_ids)
            std_devs.with_replay_ids(replay_ids)
        average = average.build_query(session).first()
        std_devs = std_devs.build_query(session).first()

        average = {n.field_name: round(float(s), 2) for n, s in zip(self.field_names, average) if s is not None}
        std_devs = {n.field_name: round(float(s), 2) for n, s in zip(self.field_names, std_devs) if s is not None}
        return {'average': average, 'std_dev': std_devs}

    def get_group_stats(self, session, replay_ids):
        return_obj = {}
        # Players
        player_tuples: List[Tuple[str, str, int]] = session.query(PlayerGame.player, func.min(PlayerGame.name),
                                      func.count(PlayerGame.player)).filter(
            PlayerGame.game.in_(replay_ids)).group_by(PlayerGame.player).all()
        return_obj['playerStats'] = {}
        # ensemble are the players that do not have enough replays to make an individual analysis for them
        ensemble = []
        for player_tuple in player_tuples:
            player, name, count = player_tuple
            if count > 1:
                player_stats = self._create_stats(session, player_filter=player, replay_ids=replay_ids)
                player_stats['name'] = name
                return_obj['playerStats'][player] = player_stats
            else:
                ensemble.append(player)
        if len(ensemble) > 0:
            # create stats that only includes the ensemble
            ensemble_stats = self._create_stats(session, player_filter=ensemble, replay_ids=replay_ids)
            return_obj['ensembleStats'] = ensemble_stats
        # STATS
        # Global
        # create stats that include all the players in the game
        # global_stats = self._create_stats(session, ids=replay_ids)
        # return_obj['globalStats'] = global_stats
        return return_obj

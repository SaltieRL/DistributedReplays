import datetime
import logging
from enum import Enum, auto

import sqlalchemy
from typing import Tuple, List

from sqlalchemy import func, cast

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import PlayerGame, Game
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.query_filter_builder import QueryFilterBuilder
from backend.database.wrapper.stats.global_stats_wrapper import GlobalStatWrapper
from backend.utils.checks import ignore_filtering

logger = logging.getLogger(__name__)


class TimeUnit(Enum):
    DAY = auto()
    MONTH = auto()
    QUARTER = auto()
    YEAR = auto()


class PlayerStatWrapper(GlobalStatWrapper):
    def __init__(self, player_wrapper: PlayerWrapper):
        super().__init__()
        self.player_wrapper = player_wrapper

        # this Object needs to be pooled per a session so only one is used at a time
        self.player_stats_filter = QueryFilterBuilder()
        if not ignore_filtering():
            self.player_stats_filter.with_relative_start_time(days_ago=30 * 6).with_safe_checking().sticky()

    def get_stats(self, session, id_, stats_query, std_query, rank=None, redis=None, raw=False, replay_ids=None,
                  playlist=13, win: bool = None):

        player_stats_filter = self.player_stats_filter.clean().clone()
        player_stats_filter.clean().with_stat_query(stats_query).with_players([id_])
        if replay_ids is not None:
            player_stats_filter.with_replay_ids(replay_ids)
        else:
            player_stats_filter.with_playlists([playlist])
        query = player_stats_filter.build_query(session).filter(PlayerGame.time_in_game > 0).filter(
            PlayerGame.game != '').group_by(PlayerGame.player)
        if win is not None:
            query = query.filter(PlayerGame.win == win)
        if query.count() < 1:
            raise CalculatedError(404, 'User does not have enough replays.')
        stats = list(query.first())
        stats = [0 if s is None else s for s in stats]
        if raw:
            return [self.float_maybe(s) for s in stats]
        else:
            global_stats, global_stds = self.get_global_stats_by_rank(session, player_stats_filter,
                                                                      stats_query, std_query, player_rank=rank,
                                                                      redis=redis,
                                                                      ids=replay_ids, playlist=playlist)
            return self.compare_to_global(stats, global_stats, global_stds)

    def get_averaged_stats(self, session, id_: str, rank: int = None, redis=None, raw: bool = False,
                           replay_ids: list = None, playlist: int = 13, win: bool = None):
        """
        Gets the averaged stats for the given ID, in either raw or standard deviation form.

        :param session: DBSession
        :param id_: Player ID to retrieve
        :param rank: rank in integer form (0-19) (optional)
        :param redis: optional redis instance, for caching/retrieving
        :param raw: return the values in raw form instead of compared to global
        :param replay_ids: replay ids to get stats from
        :param playlist: what playlist to filter by (only when replay_ids is None)
        :param win: filter by wins/losses (win = True)
        :return: stats
        """
        stats_query = self.get_player_stat_query()
        std_query = self.get_player_stat_std_query()
        total_games = self.player_wrapper.get_total_games(session, id_, replay_ids=replay_ids)
        if total_games > 0:
            stats = self.get_stats(session, id_, stats_query, std_query, rank=rank, redis=redis, raw=raw,
                                                 replay_ids=replay_ids, playlist=playlist, win=win)
        else:
            stats = [0.0] * len(stats_query)
        return self.get_wrapped_stats(stats, self.player_stats)

    def get_progression_stats(self, session, id_,
                              time_unit: 'TimeUnit' = TimeUnit.MONTH,
                              start_date: datetime.datetime = None,
                              end_date: datetime.datetime = None,
                              playlist: int = 13):

        if time_unit == TimeUnit.MONTH:
            date = func.to_char(Game.match_date, 'YY-MM')
            time_format = "%y-%m"
        elif time_unit == TimeUnit.DAY:
            date = func.to_char(Game.match_date, 'YY-MM-DD')
            time_format = "%y-%m-%d"
        elif time_unit == TimeUnit.YEAR:
            date = func.to_char(Game.match_date, 'YY')
            time_format = "%y"
        elif time_unit == TimeUnit.QUARTER:
            date = func.concat(func.to_char(Game.match_date, 'YY'), '-',
                               func.floor(cast(func.extract('quarter', Game.match_date), sqlalchemy.Numeric)))
            time_format = '%y-%m'
        else:
            # Mainly to help the linter know that time_unit is assigned.
            logger.error(f'Unknown time unit: {time_unit}. Falling back onto month.')
            date = func.to_char(Game.match_date, 'YY-MM')
            time_format = "%y-%m"

        date = date.label('date')
        mean_query = session.query(date, func.count(Game.hash),
                                   *self.get_player_stat_query()).join(
            PlayerGame).filter(PlayerGame.time_in_game > 0).filter(
            PlayerGame.player == id_).group_by(
            'date').order_by('date')
        std_query = session.query(date, func.count(Game.hash),
                                  *self.get_player_stat_std_query()).join(
            PlayerGame).filter(PlayerGame.time_in_game > 0).filter(
            PlayerGame.player == id_).group_by(
            'date').order_by('date')

        if start_date is not None:
            mean_query = mean_query.filter(Game.match_date > start_date)
            std_query = std_query.filter(Game.match_date > start_date)
        if end_date is not None:
            mean_query = mean_query.filter(Game.match_date < end_date)
            std_query = std_query.filter(Game.match_date < end_date)
        if playlist is not None:
            mean_query = mean_query.filter(Game.playlist == playlist)
            std_query = std_query.filter(Game.playlist == playlist)

        mean_query = mean_query.all()
        std_query = std_query.all()

        mean_query = [list(q) for q in mean_query]
        std_query = [list(q) for q in std_query]
        results = []
        for q, s in zip(mean_query, std_query):
            result = {
                'name': datetime.datetime.strptime(q[0], time_format),
                'average': self.get_wrapped_stats([self.float_maybe(qn) for qn in q[2:]], self.player_stats),
                'std_dev': self.get_wrapped_stats([self.float_maybe(qn) for qn in s[2:]], self.player_stats),
                'count': q[1]
            }
            if time_unit == 'quarter':
                date = result['name']
                result['name'] = datetime.datetime(date.year, (date.month - 1) * 3 + 1, 1)
            result['name'] = result['name'].isoformat()
            results.append(result)
        return results

    @staticmethod
    def get_stat_spider_charts():
        titles = [  # 'Basic',
            'Aggressiveness', 'Chemistry', 'Skill', 'Tendencies', 'Luck']
        groups = [  # ['score', 'goals', 'assists', 'saves', 'turnovers'],  # basic
            ['shots', 'possession_time', 'total_hits', 'shots/hit', 'boost_usage', 'average_speed'],  # agressive
            ['total boost efficiency', 'assists', 'passes/hit', 'total_passes', 'assists/hit'],  # chemistry
            ['turnover efficiency', 'useful/hits', 'total_aerials', 'won_turnovers', 'average_hit_distance'],  # skill
            ['time_in_attacking_third', 'time_in_attacking_half', 'time_in_defending_half', 'time_in_defending_third',
             'time_behind_ball', 'time_in_front_ball']]  # ,  # tendencies
        # ['luck1', 'luck2', 'luck3', 'luck4']]  # luck

        return [{'title': title, 'group': group} for title, group in zip(titles, groups)]

    def _create_stats(self, session, player_filter=None, replay_ids=None):
        average = QueryFilterBuilder().with_stat_query(self.get_player_stat_query())
        std_devs = QueryFilterBuilder().with_stat_query(self.get_player_stat_std_query())
        if player_filter is not None:
            average.with_players(player_filter)
            std_devs.with_players(player_filter)
        if replay_ids is not None:
            average.with_replay_ids(replay_ids)
            std_devs.with_replay_ids(replay_ids)
        average = average.build_query(session).filter(PlayerGame.time_in_game > 0).first()
        std_devs = std_devs.build_query(session).filter(PlayerGame.time_in_game > 0).first()
        average = {n.get_field_name(): round(float(s), 2) for n, s in zip(self.player_stats.stat_list, average) if
                   s is not None}
        std_devs = {n.get_field_name(): round(float(s), 2) for n, s in zip(self.player_stats.stat_list, std_devs) if
                    s is not None}
        return {'average': average, 'std_dev': std_devs}

    @with_session
    def get_group_stats(self, replay_ids, session=None):
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

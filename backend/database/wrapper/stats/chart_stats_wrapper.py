from typing import List

from sqlalchemy import func

from backend.blueprints.spa_api.errors.errors import ReplayNotFound
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import PlayerGame, Game, TeamStat
from backend.database.wrapper.chart.chart_data import ChartStatsMetadata
from backend.database.wrapper.chart.stat_point import DatabaseObjectDataPoint, StatDataPoint, OutputChartData
from backend.database.wrapper.stats.shared_stats_wrapper import SharedStatsWrapper


class ChartStatsWrapper(SharedStatsWrapper):

    @with_session
    def get_chart_stats_for_player(self, id_: str, session=None) -> List[DatabaseObjectDataPoint]:
        game: Game = session.query(Game).filter(Game.hash == id_).first()
        if game is None:
            raise ReplayNotFound()

        # this is weird because we need to do aggregate
        playergames: List = session.query(func.max(PlayerGame.id), func.bool_and(PlayerGame.is_orange),
                                          func.max(PlayerGame.name),
                                          *self.player_stats.individual_query).filter(
            PlayerGame.game == id_).group_by(PlayerGame.player).all()
        wrapped_playergames: List[DatabaseObjectDataPoint] = [
            DatabaseObjectDataPoint(id=playergame[0], is_orange=playergame[1], name=playergame[2],
                                    stats=self.get_wrapped_stats(playergame[3:], self.player_stats))
            for playergame in playergames]
        wrapped_playergames = sorted(sorted(wrapped_playergames, key=lambda x: x.id), key=lambda x: x.is_orange)

        return wrapped_playergames

    @with_session
    def get_chart_stats_for_team(self, id_: str, session=None) -> List[DatabaseObjectDataPoint]:
        game: Game = session.query(Game).filter(Game.hash == id_).first()
        if game is None:
            raise ReplayNotFound()

        # this is weird because we need to do aggregate
        team_game: List = session.query(func.bool_and(TeamStat.is_orange),
                                        *self.team_stats.individual_query).filter(
            TeamStat.game == id_).group_by(TeamStat.is_orange).all()
        wrapped_team: List[DatabaseObjectDataPoint] = [
            DatabaseObjectDataPoint(id=0, is_orange=team_game[0],
                                    name=('Orange' if team_game[0] == 1 else 'Blue'),
                                    stats=self.get_wrapped_stats(team_game[1:], self.team_stats))
            for team_game in team_game]

        wrapped_team = sorted(sorted(wrapped_team, key=lambda x: x.id), key=lambda x: x.is_orange)

        return wrapped_team

    def wrap_chart_stats(self, database_data_point: List[DatabaseObjectDataPoint],
                         chart_metadata_list: List[ChartStatsMetadata]) -> List[OutputChartData]:
        all_chart_data = []
        for basic_stats_metadata in chart_metadata_list:
            stat_name = basic_stats_metadata.stat_name
            adjusted_stat_name = stat_name.replace(' ', '_')
            data_points = []
            for player_game in database_data_point:
                # print(basic_stats_metadata.stat_name, player_game.stats.keys())
                if adjusted_stat_name in player_game.stats:
                    val = player_game.stats[adjusted_stat_name]
                    if val is None:
                        val = 0.0
                    value = float(val)
                elif stat_name in player_game.stats:
                    val = player_game.stats[stat_name]
                    if val is None:
                        val = 0.0
                    value = float(val)
                else:
                    value = 0.0
                point = StatDataPoint(
                    name=player_game.name,
                    value=value,
                    is_orange=player_game.is_orange
                )
                data_points.append(point)

            chart_data = OutputChartData(
                title=stat_name if stat_name not in self.player_stats.stat_explanation_map else self.player_stats.stat_explanation_map[stat_name].field_rename,
                chart_data_points=data_points,
                type_=basic_stats_metadata.type,
                subcategory=basic_stats_metadata.subcategory
            )
            if all(chart_data_point['value'] is None or chart_data_point['value'] == 0 for chart_data_point in
                   chart_data.chartDataPoints):
                print(basic_stats_metadata.stat_name, 'is zero')
                continue
            all_chart_data.append(chart_data)
        return all_chart_data

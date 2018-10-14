from typing import List

from flask import current_app
from sqlalchemy import func

from backend.database.objects import Game, PlayerGame
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.stats.player_stat_wrapper import PlayerStatWrapper
from backend.database.wrapper.chart.chart_data import ChartData, ChartDataPoint
from ...errors.errors import ReplayNotFound



pw = PlayerWrapper()
wrapper = PlayerStatWrapper(pw)


class StatDataPoint(ChartDataPoint):
    def __init__(self, name: str, value: float, is_orange: bool):
        super().__init__(name, value)
        self.isOrange = is_orange


class PlayerDataPoint:
    def __init__(self, id: int, name: str, is_orange: bool, stats: dict):
        self.id = id
        self.name = name
        self.is_orange = is_orange
        self.stats = stats


class BasicStatChartData(ChartData):
    def __init__(self, title: str, chart_data_points: List[StatDataPoint], type_: str, subcategory: str):
        super().__init__(title, chart_data_points)
        self.type = type_
        self.subcategory = subcategory

    @staticmethod
    def create_from_id(id_: str) -> List['BasicStatChartData']:
        session = current_app.config['db']()
        game: Game = session.query(Game).filter(Game.hash == id_).first()
        # this is weird because we need to do aggregate
        playergames: List = session.query(func.max(PlayerGame.id), func.bool_and(PlayerGame.is_orange),
                                          func.max(PlayerGame.name),
                                          *wrapper.individual_query).filter(
            PlayerGame.game == id_).group_by(PlayerGame.player).all()
        wrapped_playergames: List[PlayerDataPoint] = [
            PlayerDataPoint(id=playergame[0], is_orange=playergame[1], name=playergame[2],
                            stats=wrapper.get_wrapped_stats(playergame[3:]))
            for playergame in playergames]
        if game is None:
            raise ReplayNotFound()

        all_chart_data = []
        wrapped_playergames = sorted(sorted(wrapped_playergames, key=lambda x: x.id),
                                     key=lambda x: x.is_orange)
        for basic_stats_metadata in basic_stats_metadatas:
            datapoints = []
            for player_game in wrapped_playergames:
                if basic_stats_metadata.stat_name in player_game.stats:
                    value = float(player_game.stats[basic_stats_metadata.stat_name])
                else:
                    value = 0.0
                point = StatDataPoint(
                    name=player_game.name,
                    value=value,
                    is_orange=player_game.is_orange
                )
                datapoints.append(point)

            chart_data = BasicStatChartData(
                title=basic_stats_metadata.stat_name,
                chart_data_points=datapoints,
                type_=basic_stats_metadata.type,
                subcategory=basic_stats_metadata.subcategory
            )
            if all(chart_data_point['value'] is None or chart_data_point['value'] == 0 for chart_data_point in
                   chart_data.chartDataPoints):
                continue
            all_chart_data.append(chart_data)
        session.close()
        return all_chart_data

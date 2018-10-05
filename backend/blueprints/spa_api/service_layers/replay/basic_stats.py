from enum import auto, Enum
from typing import List

from flask import current_app
from sqlalchemy import func

from backend.database.objects import Game, PlayerGame
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.stats.player_stat_wrapper import PlayerStatWrapper
from ..chart_data import ChartData, ChartDataPoint
from ...errors.errors import ReplayNotFound


class ChartType(Enum):
    radar = auto()
    bar = auto()
    pie = auto()


class BasicStatSubcategory(Enum):
    Hits = auto()
    Ball = auto()
    Positioning = auto()
    Playstyles = auto()
    Possession = auto()
    Boosts = auto()
    Efficiency = auto()


class BasicStatsMetadata:
    def __init__(self, stat_name: str, type_: ChartType, subcategory: BasicStatSubcategory):
        self.stat_name = stat_name
        self.type = type_.name
        self.subcategory = subcategory.name


SubCat = BasicStatSubcategory
Metadata = BasicStatsMetadata

basic_stats_metadatas = [
    # Hits
    Metadata('hits', ChartType.radar, SubCat.Hits),
    Metadata('avg hit dist', ChartType.radar, SubCat.Hits),
    Metadata('ball hit forward', ChartType.bar, SubCat.Hits),
    Metadata('dribbles', ChartType.bar, SubCat.Hits),
    Metadata('passes', ChartType.bar, SubCat.Hits),
    Metadata('aerials', ChartType.bar, SubCat.Hits),

    # Ball
    Metadata('time close to ball', ChartType.radar, SubCat.Ball),
    Metadata('time closest to ball', ChartType.pie, SubCat.Ball),
    Metadata('time furthest from ball', ChartType.pie, SubCat.Ball),
    Metadata('time behind ball', ChartType.radar, SubCat.Ball),
    Metadata('time in front ball', ChartType.radar, SubCat.Ball),

    # Positioning
    Metadata('time high in air', ChartType.radar, SubCat.Positioning),
    Metadata('time low in air', ChartType.radar, SubCat.Positioning),
    Metadata('time on ground', ChartType.radar, SubCat.Positioning),
    Metadata('time in defending third', ChartType.radar, SubCat.Positioning),
    Metadata('time in neutral third', ChartType.radar, SubCat.Positioning),
    Metadata('time in attacking third', ChartType.radar, SubCat.Positioning),
    Metadata('time in defending half', ChartType.radar, SubCat.Positioning),
    Metadata('time in attacking half', ChartType.radar, SubCat.Positioning),

    # playstyles
    Metadata('speed', ChartType.radar, SubCat.Playstyles),
    Metadata('time at boost speed', ChartType.radar, SubCat.Playstyles),
    Metadata('time at slow speed', ChartType.radar, SubCat.Playstyles),
    Metadata('time at super sonic', ChartType.radar, SubCat.Playstyles),

    # Positioning
    Metadata('possession', ChartType.pie, SubCat.Possession),
    Metadata('turnovers', ChartType.bar, SubCat.Possession),
    Metadata('turnovers on my half', ChartType.bar, SubCat.Possession),
    Metadata('turnovers on their half', ChartType.bar, SubCat.Possession),

    # boost
    Metadata('boost usage', ChartType.radar, SubCat.Boosts),
    Metadata('wasted collection', ChartType.radar, SubCat.Boosts),
    Metadata('wasted usage', ChartType.radar, SubCat.Boosts),
    Metadata('num small boosts', ChartType.bar, SubCat.Boosts),
    Metadata('num large boosts', ChartType.bar, SubCat.Boosts),
    Metadata('num stolen boosts', ChartType.bar, SubCat.Boosts),
    Metadata('time full boost', ChartType.radar, SubCat.Boosts),
    Metadata('time low boost', ChartType.radar, SubCat.Boosts),
    Metadata('time no boost', ChartType.radar, SubCat.Boosts),
    Metadata('boost ratio', ChartType.bar, SubCat.Boosts),

    # efficiency
    Metadata('collection boost efficiency', ChartType.bar, SubCat.Efficiency),
    Metadata('used boost efficiency', ChartType.bar, SubCat.Efficiency),
    Metadata('total boost efficiency', ChartType.bar, SubCat.Efficiency),
    Metadata('turnover efficiency', ChartType.bar, SubCat.Efficiency),
    Metadata('shot %', ChartType.bar, SubCat.Efficiency),
    Metadata('useful/hits', ChartType.radar, SubCat.Efficiency),
    Metadata('aerial efficiency', ChartType.radar, SubCat.Efficiency),
]
pw = PlayerWrapper()
wrapper = PlayerStatWrapper(pw)


class StatDataPoint(ChartDataPoint):
    def __init__(self, name: str, value: float, is_orange: bool):
        super().__init__(name, value)
        self.isOrange = is_orange


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
        wrapped_playergames: List[dict] = [{**{
            'id': playergame[0],
            'is orange': playergame[1],
            'name': playergame[2]
        }, **wrapper.get_wrapped_stats(playergame[2:])}
                                           for playergame in playergames]
        if game is None:
            raise ReplayNotFound()
        print(wrapped_playergames[0])
        all_chart_data = []
        for basic_stats_metadata in basic_stats_metadatas:
            datapoints = []
            for player_game in sorted(sorted(wrapped_playergames, key=lambda x: x['is orange']), key=lambda x: x['id']):
                if basic_stats_metadata.stat_name in player_game:
                    value = float(player_game[basic_stats_metadata.stat_name])
                elif hasattr(player_game, basic_stats_metadata.stat_name):
                    value = getattr(player_game, basic_stats_metadata.stat_name)
                else:
                    value = 0.0
                point = StatDataPoint(
                    name=player_game['name'],
                    value=value,
                    is_orange=player_game['is orange']
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

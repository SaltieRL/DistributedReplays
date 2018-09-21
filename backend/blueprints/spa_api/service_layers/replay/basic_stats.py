from enum import auto, Enum
from typing import List, cast

from flask import current_app

from backend.database.objects import Game, PlayerGame
from ..chart_data import ChartData, ChartDataPoint
from ..utils import sort_player_games_by_team_then_id
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


class BasicStatsMetadata:
    def __init__(self, stat_name: str, type_: ChartType, subcategory: BasicStatSubcategory):
        self.stat_name = stat_name
        self.type = type_.name
        self.subcategory = subcategory.name


SubCat = BasicStatSubcategory
Metadata = BasicStatsMetadata

basic_stats_metadatas = [
    # Hits
    Metadata('total_hits', ChartType.radar, SubCat.Hits),
    Metadata('average_hit_distance', ChartType.radar, SubCat.Hits),
    Metadata('ball_hit_forward', ChartType.bar, SubCat.Hits),
    Metadata('total_dribbles', ChartType.bar, SubCat.Hits),
    Metadata('total_passes', ChartType.bar, SubCat.Hits),
    Metadata('total_aerials', ChartType.bar, SubCat.Hits),

    # Ball
    Metadata('time_close_to_ball', ChartType.radar, SubCat.Ball),
    Metadata('time_closest_to_ball', ChartType.pie, SubCat.Ball),
    Metadata('time_furthest_from_ball', ChartType.pie, SubCat.Ball),
    Metadata('time_behind_ball', ChartType.radar, SubCat.Ball),
    Metadata('time_in_front_ball', ChartType.radar, SubCat.Ball),

    # Positioning
    Metadata('time_high_in_air', ChartType.radar, SubCat.Positioning),
    Metadata('time_low_in_air', ChartType.radar, SubCat.Positioning),
    Metadata('time_on_ground', ChartType.radar, SubCat.Positioning),
    Metadata('time_in_defending_third', ChartType.radar, SubCat.Positioning),
    Metadata('time_in_neutral_third', ChartType.radar, SubCat.Positioning),
    Metadata('time_in_attacking_third', ChartType.radar, SubCat.Positioning),
    Metadata('time_in_defending_half', ChartType.radar, SubCat.Positioning),
    Metadata('time_in_attacking_half', ChartType.radar, SubCat.Positioning),

    # playstyles
    Metadata('average_speed', ChartType.radar, SubCat.Playstyles),
    Metadata('time_at_boost_speed', ChartType.radar, SubCat.Playstyles),
    Metadata('time_at_slow_speed', ChartType.radar, SubCat.Playstyles),
    Metadata('time_at_super_sonic', ChartType.radar, SubCat.Playstyles),

    # Positioning
    Metadata('possession_time', ChartType.pie, SubCat.Possession),
    Metadata('turnovers', ChartType.bar, SubCat.Possession),
    Metadata('turnovers_on_my_half', ChartType.bar, SubCat.Possession),
    Metadata('turnovers_on_their_half', ChartType.bar, SubCat.Possession),

    # boost
    Metadata('boost_usage', ChartType.radar, SubCat.Boosts),
    Metadata('wasted_collection', ChartType.radar, SubCat.Boosts),
    Metadata('wasted_usage', ChartType.radar, SubCat.Boosts),
    Metadata('num_small_boosts', ChartType.bar, SubCat.Boosts),
    Metadata('num_large_boosts', ChartType.bar, SubCat.Boosts),
    Metadata('num_stolen_boosts', ChartType.bar, SubCat.Boosts),
    Metadata('time_full_boost', ChartType.radar, SubCat.Boosts),
    Metadata('time_low_boost', ChartType.radar, SubCat.Boosts),
    Metadata('time_no_boost', ChartType.radar, SubCat.Boosts),
]


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
        if game is None:
            raise ReplayNotFound()

        all_chart_data = []
        for basic_stats_metadata in basic_stats_metadatas:
            chart_data = BasicStatChartData(
                title=basic_stats_metadata.stat_name,
                chart_data_points=[
                    StatDataPoint(
                        name=player_game.name,
                        value=player_game.__getattribute__(basic_stats_metadata.stat_name),
                        # TODO: Investigate proper way to get attribute
                        is_orange=player_game.is_orange
                    )
                    for player_game in sort_player_games_by_team_then_id(
                        cast(List[PlayerGame], game.playergames))
                ],
                type_=basic_stats_metadata.type,
                subcategory=basic_stats_metadata.subcategory
            )
            if all(chart_data_point['value'] is None for chart_data_point in chart_data.chartDataPoints):
                continue
            all_chart_data.append(chart_data)
        session.close()
        return all_chart_data

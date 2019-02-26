from enum import auto

from backend.database.wrapper.chart.chart_data import ChartType, ChartSubcatagory, ChartStatsMetadata


class BasicStatSubcategory(ChartSubcatagory):
    Hits = auto()
    Ball = auto()
    Playstyles = auto()
    Possession = auto()
    Positioning = auto()
    Boosts = auto()
    Efficiency = auto()
    Team_Positioning = auto()


SubCat = BasicStatSubcategory
Metadata = ChartStatsMetadata

player_stats_metadata = [
    # Hits
    Metadata('hits', ChartType.radar, SubCat.Hits),
    Metadata('average hit distance', ChartType.radar, SubCat.Hits),
    Metadata('ball hit forward', ChartType.bar, SubCat.Hits),
    Metadata('total_dribbles', ChartType.bar, SubCat.Hits),
    Metadata('total_passes', ChartType.bar, SubCat.Hits),
    Metadata('total_aerials', ChartType.bar, SubCat.Hits),

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
    Metadata('time near wall', ChartType.radar, SubCat.Positioning),
    Metadata('time in corner', ChartType.radar, SubCat.Positioning),

    # playstyles
    Metadata('average_speed', ChartType.radar, SubCat.Playstyles),
    Metadata('time at boost speed', ChartType.radar, SubCat.Playstyles),
    Metadata('time at slow speed', ChartType.radar, SubCat.Playstyles),
    Metadata('time at super sonic', ChartType.radar, SubCat.Playstyles),

    # Possession
    Metadata('possession_time', ChartType.pie, SubCat.Possession),
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
    Metadata('total boost efficiency', ChartType.radar, SubCat.Efficiency),
    Metadata('turnover efficiency', ChartType.radar, SubCat.Efficiency),
    Metadata('shot %', ChartType.bar, SubCat.Efficiency),
    Metadata('useful/hits', ChartType.radar, SubCat.Efficiency),
    Metadata('aerial efficiency', ChartType.radar, SubCat.Efficiency),

    # team positioning
    Metadata('time in front of center of mass', ChartType.radar, SubCat.Team_Positioning),
    Metadata('time behind center of mass', ChartType.radar, SubCat.Team_Positioning),
    Metadata('time most forward player', ChartType.bar, SubCat.Team_Positioning),
    Metadata('time most back player', ChartType.bar, SubCat.Team_Positioning),
    Metadata('time between players', ChartType.bar, SubCat.Team_Positioning),
]

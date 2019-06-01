from enum import auto

from backend.database.wrapper.chart.chart_data import ChartSubcatagory, ChartStatsMetadata, ChartType


class TeamStatSubcategory(ChartSubcatagory):
    CenterOfMass = auto()
    Positioning = auto()


SubCat = TeamStatSubcategory
Metadata = ChartStatsMetadata


team_stats_metadata = [
    # Positioning
    Metadata('time_high_in_air', ChartType.bar, SubCat.Positioning),
    Metadata('time_low_in_air', ChartType.bar, SubCat.Positioning),
    Metadata('time_on_ground', ChartType.bar, SubCat.Positioning),
    Metadata('time_in_defending_third', ChartType.bar, SubCat.Positioning),
    Metadata('time_in_neutral_third', ChartType.bar, SubCat.Positioning),
    Metadata('time_in_attacking_third', ChartType.bar, SubCat.Positioning),
    Metadata('time_in_defending_half', ChartType.bar, SubCat.Positioning),
    Metadata('time_in_attacking_half', ChartType.bar, SubCat.Positioning),
    Metadata('time_near_wall', ChartType.bar, SubCat.Positioning),
    Metadata('time_in_corner', ChartType.bar, SubCat.Positioning),

    # Center of mass
    Metadata('average_distance_from_center', ChartType.bar, SubCat.CenterOfMass),
    Metadata('average_max_distance_from_center', ChartType.bar, SubCat.CenterOfMass),
    Metadata('time_clumped', ChartType.bar, SubCat.CenterOfMass),
    Metadata('time_boondocks', ChartType.bar, SubCat.CenterOfMass),
]

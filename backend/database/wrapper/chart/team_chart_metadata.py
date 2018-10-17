from enum import auto

from backend.database.wrapper.chart.chart_data import ChartSubcatagory, ChartStatsMetadata, ChartType


class TeamStatSubcategory(ChartSubcatagory):
    CenterOfMass = auto()
    Positioning = auto()


SubCat = TeamStatSubcategory
Metadata = ChartStatsMetadata


team_stats_metadata = [
    # Positioning
    Metadata('time high in air', ChartType.bar, SubCat.Positioning),
    Metadata('time low in air', ChartType.bar, SubCat.Positioning),
    Metadata('time on ground', ChartType.bar, SubCat.Positioning),
    Metadata('time in defending third', ChartType.bar, SubCat.Positioning),
    Metadata('time in neutral third', ChartType.bar, SubCat.Positioning),
    Metadata('time in attacking third', ChartType.bar, SubCat.Positioning),
    Metadata('time in defending half', ChartType.bar, SubCat.Positioning),
    Metadata('time in attacking half', ChartType.bar, SubCat.Positioning),
    Metadata('time near wall', ChartType.bar, SubCat.Positioning),
    Metadata('time in corner', ChartType.bar, SubCat.Positioning),

    # Center of mass
    Metadata('average distance from center', ChartType.bar, SubCat.CenterOfMass),
    Metadata('average max distance from center', ChartType.bar, SubCat.CenterOfMass),
    Metadata('time clumped', ChartType.bar, SubCat.CenterOfMass),
    Metadata('time boondocks', ChartType.bar, SubCat.CenterOfMass),
]

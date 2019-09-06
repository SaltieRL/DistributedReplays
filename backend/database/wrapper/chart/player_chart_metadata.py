from enum import auto

from backend.database.wrapper.chart.chart_data import ChartType, ChartSubcatagory, ChartStatsMetadata


class BasicStatSubcategory(ChartSubcatagory):
    Main_Stats = auto()
    Hits = auto()
    Ball = auto()
    Playstyles = auto()
    Possession = auto()
    Positioning = auto()
    Boosts = auto()
    Efficiency = auto()
    Team_Positioning = auto()
    Ball_Carries = auto()


SubCat = BasicStatSubcategory
Metadata = ChartStatsMetadata

player_stats_metadata = [
    # Hits
    Metadata('hits', ChartType.radar, SubCat.Hits),
    Metadata('average_hit_distance', ChartType.radar, SubCat.Hits),
    Metadata('ball_hit_forward', ChartType.bar, SubCat.Hits),
    Metadata('total_dribbles', ChartType.bar, SubCat.Hits),
    Metadata('total_passes', ChartType.bar, SubCat.Hits),
    Metadata('total_aerials', ChartType.bar, SubCat.Hits),
    Metadata('total_flicks', ChartType.bar, SubCat.Hits),

    # Carries
    Metadata('total_carries', ChartType.bar, SubCat.Ball_Carries),
    Metadata('total_flicks', ChartType.bar, SubCat.Ball_Carries),
    Metadata('longest_carry', ChartType.bar, SubCat.Ball_Carries),
    Metadata('furthest_carry', ChartType.bar, SubCat.Ball_Carries),
    Metadata('total_carry_time', ChartType.bar, SubCat.Ball_Carries),
    Metadata('average_carry_time', ChartType.bar, SubCat.Ball_Carries),
    Metadata('fastest_carry_speed', ChartType.bar, SubCat.Ball_Carries),
    Metadata('total_carry_distance', ChartType.bar, SubCat.Ball_Carries),
    Metadata('average_carry_speed', ChartType.bar, SubCat.Ball_Carries),
    Metadata('distance_along_path', ChartType.bar, SubCat.Ball_Carries),

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
    Metadata('time_near_wall', ChartType.radar, SubCat.Positioning),
    Metadata('time_in_corner', ChartType.radar, SubCat.Positioning),

    # playstyles
    Metadata('average_speed', ChartType.radar, SubCat.Playstyles),
    Metadata('time_at_boost_speed', ChartType.radar, SubCat.Playstyles),
    Metadata('time_at_slow_speed', ChartType.radar, SubCat.Playstyles),
    Metadata('time_at_super_sonic', ChartType.radar, SubCat.Playstyles),

    # Possession
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
    Metadata('boost_ratio', ChartType.bar, SubCat.Boosts),
    Metadata('wasted_big', ChartType.bar, SubCat.Boosts),
    Metadata('wasted_small', ChartType.bar, SubCat.Boosts),

    # efficiency
    Metadata('collection_boost_efficiency', ChartType.bar, SubCat.Efficiency),
    Metadata('used_boost_efficiency', ChartType.bar, SubCat.Efficiency),
    Metadata('total_boost_efficiency', ChartType.radar, SubCat.Efficiency),
    Metadata('turnover_efficiency', ChartType.radar, SubCat.Efficiency),
    Metadata('shot_%', ChartType.bar, SubCat.Efficiency),
    Metadata('useful/hits', ChartType.radar, SubCat.Efficiency),
    Metadata('aerial_efficiency', ChartType.radar, SubCat.Efficiency),

    # team positioning
    Metadata('time_in_front_of_center_of_mass', ChartType.radar, SubCat.Team_Positioning),
    Metadata('time_behind_center_of_mass', ChartType.radar, SubCat.Team_Positioning),
    Metadata('time_most_forward_player', ChartType.bar, SubCat.Team_Positioning),
    Metadata('time_most_back_player', ChartType.bar, SubCat.Team_Positioning),
    Metadata('time_between_players', ChartType.bar, SubCat.Team_Positioning),

    # team positioning
    Metadata('time_in_front_of_center_of_mass', ChartType.bar, SubCat.Team_Positioning),
    Metadata('time_behind_center_of_mass', ChartType.radar, SubCat.Team_Positioning),
    Metadata('time_most_forward_player', ChartType.bar, SubCat.Team_Positioning),
    Metadata('time_most_back_player', ChartType.bar, SubCat.Team_Positioning),
    Metadata('time_between_players', ChartType.bar, SubCat.Team_Positioning),
]

player_group_stats_metadata = player_stats_metadata + [
    # Main Stats
    Metadata('score', ChartType.bar, SubCat.Main_Stats),
    Metadata('goals', ChartType.bar, SubCat.Main_Stats),
    Metadata('assists', ChartType.bar, SubCat.Main_Stats),
    Metadata('saves', ChartType.bar, SubCat.Main_Stats),
    Metadata('shots', ChartType.bar, SubCat.Main_Stats)
]

import sqlalchemy
from sqlalchemy import func, case, cast

from backend.database.objects import PlayerGame


def safe_divide(sql_value, default=1):
    return case([
        (sql_value == 0, default),
        (sql_value != 0, sql_value)
    ])


def get_total_boost_efficiency():
    wasted = PlayerGame.wasted_collection + PlayerGame.wasted_usage
    boost_total = PlayerGame.num_large_boosts * 100 + PlayerGame.num_small_boosts * 12
    return wasted / safe_divide(boost_total)


def get_collection_boost_efficiency():
    wasted = PlayerGame.wasted_collection
    boost_total = PlayerGame.num_large_boosts * 100 + PlayerGame.num_small_boosts * 12
    return wasted / safe_divide(boost_total)


def get_used_boost_efficiency():
    wasted = PlayerGame.wasted_usage
    boost_total = PlayerGame.boost_usage
    return wasted / safe_divide(boost_total)


def get_shots_per_non_dribble():
    return (100 * PlayerGame.shots) / safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts)


def get_hits_non_dribbles():
    return PlayerGame.total_hits - PlayerGame.total_dribble_conts


def get_passes_per_non_dribble():
    return (100 * PlayerGame.total_passes) / safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts)


def get_assists_per_non_dribble():
    return (100 * PlayerGame.assists) / safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts)


def get_useful_hit_per_non_dribble():
    return (100 * (PlayerGame.shots + PlayerGame.total_passes + PlayerGame.total_saves + PlayerGame.total_goals) /
            safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts))


def get_shot_percent():
    return func.sum(PlayerGame.goals) / safe_divide(cast(func.sum(PlayerGame.shots), sqlalchemy.Numeric))


def get_negative_turnover_per_non_dribble():
    return -100 * PlayerGame.turnovers / safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts)


def get_boost_ratio():
    return safe_divide(PlayerGame.num_small_boosts) / safe_divide(PlayerGame.num_large_boosts)


def get_aerial_efficiency():
    air_time = PlayerGame.time_high_in_air + PlayerGame.time_low_in_air / safe_divide(PlayerGame.time_in_game,
                                                                                      default=300)
    return PlayerGame.total_aerials / safe_divide(air_time, default=100)

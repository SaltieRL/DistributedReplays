from sqlalchemy import func, case

from backend.database.objects import PlayerGame


def safe_divide(sql_value):
    return func.greatest(sql_value, 1)


def replay_divide(sql_value):
    return case([
        (sql_value == 0, 300.0),
        (sql_value != 0, sql_value)
    ])


def get_total_boost_efficiency():
    wasted = PlayerGame.wasted_collection + PlayerGame.wasted_usage
    boost_total = PlayerGame.num_large_boosts * 100 + PlayerGame.num_small_boosts * 12 + PlayerGame.boost_usage
    return wasted / safe_divide(boost_total)


def get_collection_boost_efficiency():
    wasted = PlayerGame.wasted_collection
    boost_total = PlayerGame.num_large_boosts * 100 + PlayerGame.num_small_boosts * 12
    return wasted / safe_divide(boost_total)


def get_used_boost_efficiency():
    wasted = PlayerGame.wasted_usage
    boost_total = PlayerGame.boost_usage
    return wasted / safe_divide(boost_total)

from sqlalchemy import func

from backend.database.objects import PlayerGame

def safe_divide(sql_value):
    return func.greatest(sql_value, 1)


def get_boost_efficiency():
    wasted_collection = PlayerGame.wasted_collection - PlayerGame.num_stolen_boosts * 100
    wasted_total = wasted_collection + PlayerGame.wasted_usage
    return wasted_total / safe_divide(PlayerGame.boost_usage)

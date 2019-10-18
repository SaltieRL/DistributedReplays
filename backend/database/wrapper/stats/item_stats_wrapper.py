import datetime
import json

from carball.generated.api.metadata import player_loadout_pb2
from sqlalchemy import func, desc, literal

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Loadout, Game
from backend.database.startup import lazy_get_redis
from backend.database.utils.dynamic_field_manager import create_and_filter_proto_field
from backend.utils.rlgarage_handler import RLGarageAPI


class ItemResult:
    def __init__(self, item_id, item_paint, count):
        self.item_id = item_id
        self.item_paint = item_paint
        self.count = count


def date_converter(o):
    if isinstance(o, datetime.datetime) or isinstance(o, datetime.date):
        return o.__str__()


class ItemStatsWrapper:
    @staticmethod
    def create_stats(session):
        dynamic_field_list = create_and_filter_proto_field(player_loadout_pb2.PlayerLoadout, ['load_out_id', 'version'],
                                                           [],
                                                           Loadout)
        dynamic_field_list = [field for field in dynamic_field_list if 'paint' not in field.field_name]
        no_paint = ['engine_audio']
        result_map = {}
        for dynamic_field in dynamic_field_list:
            inner = session.query(Loadout) \
                .join(Game, Game.hash == Loadout.game) \
                .filter(Loadout.player != Game.primary_player) \
                .distinct(Loadout.player) \
                .order_by(desc(Loadout.player), desc(Game.match_date)) \
                .subquery()
            query_field = getattr(inner.c, dynamic_field.field_name)
            if dynamic_field.field_name not in no_paint:
                query_field_paint = getattr(inner.c, dynamic_field.field_name + '_paint')
                stats = session.query(query_field,
                                      query_field_paint,
                                      func.count(inner.c.id).label('count')) \
                    .group_by(query_field, query_field_paint) \
                    .order_by(desc('count')).all()
            else:
                stats = session.query(query_field,
                                      literal(0),
                                      func.count(inner.c.id).label('count')) \
                    .group_by(query_field) \
                    .order_by(desc('count'))
                stats = stats.all()
            results = [ItemResult(*s).__dict__ for s in stats]
            result_map[dynamic_field.field_name] = results
        return result_map

    @staticmethod
    @with_session
    def get_item_usage_over_time(id_, session):
        result = ItemStatsWrapper.get_redis_result_if_exists("items_get_item_usage_over_time_", id_)
        if result is not None:
            return result
        category_map = {
            1: Loadout.car,
            2: Loadout.wheels,
            3: Loadout.boost,
            4: Loadout.topper,
            5: Loadout.antenna,
            6: Loadout.skin,
            9: Loadout.trail,
            10: Loadout.goal_explosion,
            11: Loadout.banner,
            12: Loadout.engine_audio
        }
        category = RLGarageAPI().get_item(id_)['category']
        loadout_item = category_map[category]
        date = func.date(Game.match_date)
        inner = session.query(date.label('date'),
                              Loadout.player,
                              loadout_item) \
            .join(Game, Loadout.game == Game.hash) \
            .distinct(Loadout.player, date) \
            .filter(loadout_item == id_) \
            .filter(Loadout.player != Game.primary_player) \
            .filter(date >= datetime.date(2019, 9, 13)) \
            .filter(date < datetime.date.fromtimestamp(datetime.datetime.utcnow().timestamp())) \
            .group_by(date, Loadout.player, loadout_item) \
            .subquery()
        inner2 = session.query(date.label('date'),
                               Loadout.player) \
            .join(Game, Loadout.game == Game.hash) \
            .filter(Loadout.player != Game.primary_player) \
            .distinct(Loadout.player, date) \
            .group_by(date, Loadout.player) \
            .subquery()
        stats = session.query(inner.c.date, func.count(inner.c.player).label('count')) \
            .group_by(inner.c.date).subquery()
        stats2 = session.query(inner2.c.date, func.count(inner2.c.player).label('count')) \
            .group_by(inner2.c.date).subquery()
        final = session.query(stats.c.date, stats.c.count, stats2.c.count) \
            .join(stats2, stats.c.date == stats2.c.date).order_by(stats.c.date)
        data = {'data': [
            {
                'date': r[0],
                'count': r[1],
                'total': r[2]
            } for r in final.all()]
        }
        ItemStatsWrapper.set_redis_result_if_exists("items_get_item_usage_over_time_", id_, data)
        return data

    @staticmethod
    def get_most_used_by_column(field_name, session):
        result = ItemStatsWrapper.get_redis_result_if_exists("items_get_most_used_by_column_", field_name)
        if result is not None:
            return result
        inner = session.query(Loadout) \
            .join(Game, Game.hash == Loadout.game) \
            .filter(Loadout.player != Game.primary_player) \
            .distinct(Loadout.player) \
            .order_by(desc(Loadout.player), desc(Game.match_date)) \
            .subquery()

        query_field = getattr(inner.c, field_name)
        stats = session.query(query_field,
                              literal(0),
                              func.count(inner.c.id).label('count')) \
            .group_by(query_field) \
            .order_by(desc('count'))
        stats = stats.all()
        stats = [s for s in stats if s[0] != 0]
        ItemStatsWrapper.set_redis_result_if_exists("items_get_most_used_by_column_", field_name, stats)
        return stats

    @staticmethod
    @with_session
    def create_unpainted_stats(category=None, session=None):
        key = category if category is not None else "None"
        result = ItemStatsWrapper.get_redis_result_if_exists("items_create_unpainted_stats_",
                                                             key)
        if result is not None:
            return result
        category_map = {
            'car': 1,
            'wheels': 2,
            'boost': 3,
            'topper': 4,
            'antenna': 5,
            'skin': 6,
            'trail': 9,
            'goal_explosion': 10,
            'banner': 11,
            'engine_audio': 12,
        }
        category_map_inv = {v: k for k, v in category_map.items()}
        if category is not None:
            stats = ItemStatsWrapper.get_most_used_by_column(category_map_inv[category], session)
            stats = [ItemResult(*s).__dict__['item_id'] for s in stats]
            ItemStatsWrapper.set_redis_result_if_exists("items_create_unpainted_stats_", key, stats)
            return stats

        dynamic_field_list = create_and_filter_proto_field(player_loadout_pb2.PlayerLoadout, ['load_out_id', 'version'],
                                                           [],
                                                           Loadout)
        dynamic_field_list = [field for field in dynamic_field_list if 'paint' not in field.field_name]
        result_map = {}

        for dynamic_field in dynamic_field_list:
            stats = ItemStatsWrapper.get_most_used_by_column(dynamic_field.field_name, session)
            results = [ItemResult(*s).__dict__['item_id'] for s in stats]
            result_map[category_map[dynamic_field.field_name]] = results
        ItemStatsWrapper.set_redis_result_if_exists("items_create_unpainted_stats_", key, result_map)
        return result_map

    @staticmethod
    def get_redis_result_if_exists(prefix: str, id_):
        redis_key = prefix + str(id_)
        r = lazy_get_redis()
        if r is not None:
            result = r.get(redis_key)
            if result is not None:
                return json.loads(result)
        return None

    @staticmethod
    def set_redis_result_if_exists(prefix: str, id_: int or str, value):
        redis_key = prefix + str(id_)
        r = lazy_get_redis()
        if r is not None:
            r.set(redis_key, json.dumps(value, default=date_converter), ex=12 * 60 * 60)


if __name__ == '__main__':
    print(ItemStatsWrapper.create_unpainted_stats())

import datetime

from carball.generated.api.metadata import player_loadout_pb2
from sqlalchemy import func, desc, literal, Date, Float

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Loadout, Game
from backend.database.utils.dynamic_field_manager import create_and_filter_proto_field


class ItemResult:
    def __init__(self, item_id, item_paint, count):
        self.item_id = item_id
        self.item_paint = item_paint
        self.count = count


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
        date = func.date(Game.match_date)
        inner = session.query(date.label('date'),
                              Loadout.player,
                              Loadout.antenna) \
            .join(Game, Loadout.game == Game.hash) \
            .distinct(Loadout.player, date) \
            .filter(Loadout.wheels == id_) \
            .filter(date >= datetime.date(2019, 9, 13)) \
            .group_by(date, Loadout.player, Loadout.antenna) \
            .subquery()
        inner2 = session.query(date.label('date'),
                               Loadout.player) \
            .join(Game, Loadout.game == Game.hash) \
            .distinct(Loadout.player, date) \
            .group_by(date, Loadout.player) \
            .subquery()
        stats = session.query(inner.c.date, func.count(inner.c.player).label('count')) \
            .group_by(inner.c.date).subquery()
        stats2 = session.query(inner2.c.date, func.count(inner2.c.player).label('count')) \
            .group_by(inner2.c.date).subquery()
        final = session.query(stats.c.date, stats.c.count, stats2.c.count) \
            .join(stats2, stats.c.date == stats2.c.date).order_by(stats.c.date)
        return {'data': [
            {
                'date': r[0],
                'count': r[1],
                'total': r[2]
            } for r in final.all()]
        }


if __name__ == '__main__':
    print(ItemStatsWrapper.get_item_usage_over_time(3000))

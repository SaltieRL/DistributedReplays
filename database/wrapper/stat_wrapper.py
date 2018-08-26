from database.objects import PlayerGame
from sqlalchemy import func, desc, cast, String
from data import constants
from helpers.dynamic_field_manager import create_and_filter_proto_field, add_dynamic_fields
from replayanalysis.replay_analysis.generated.api import player_pb2


class ComputedStat:
    def __init__(self, field_name, stat_value):
        self.stat_value = stat_value
        self.field_name = field_name


class PlayerStatWrapper:

    def __init__(self):
        self.stats_query, self.field_names = self.get_stats_query()

    def get_wrapped_stats(self, stats):
        return [ComputedStat(stat, field.field_name) for stat, field in zip(stats, self.field_names)]

    def get_averaged_stats(self, id_, session):
        stats_query = self.stats_query
        games = session.query(PlayerGame).filter(PlayerGame.player == id_).filter(
            PlayerGame.game != None).all()  # type: List[PlayerGame]
        if len(games) > 0:
            fav_car_str = session.query(PlayerGame.car, func.count(PlayerGame.car).label('c')).filter(
                PlayerGame.player == id_).filter(
                PlayerGame.game != None).group_by(PlayerGame.car).order_by(desc('c')).first()
            print(fav_car_str)
            # car_arr = [g.car for g in games]
            favorite_car = constants.cars[int(fav_car_str[0])]
            favorite_car_pctg = fav_car_str[1] / len(games)
            q = session.query(*stats_query).filter(PlayerGame.a_hits > 0)
            global_stats = q.first()
            stats = list(q.filter(PlayerGame.player == id_).first())

            for i, s in enumerate(stats):
                player_stat = s
                if player_stat is None:
                    player_stat = 0
                global_stat = global_stats[i]
                if global_stat is None or global_stat == 0:
                    global_stat = 1
                stats[i] = float(player_stat / global_stat)
        else:
            favorite_car = "Unknown"
            favorite_car_pctg = 0.0
            stats = [0.0] * len(stats_query)
        return games, self.get_wrapped_stats(stats), favorite_car, favorite_car_pctg

    @staticmethod
    def get_stats_query():
        field_list = create_and_filter_proto_field(proto_message=player_pb2.Player,
                                                   blacklist_field_names=['name', 'title_id', 'is_orange'],
                                                   blacklist_message_types=['api.metadata.CameraSettings',
                                                                            'api.metadata.PlayerLoadout',
                                                                            'api.PlayerId'],
                                                   db_object=PlayerGame)
        stat_list = []
        for field in field_list:
            field = getattr(PlayerGame, field.field_name)
            stat_list.append(func.avg(field))

        stat_list += func.avg(PlayerGame.a_possession), \
            func.avg(PlayerGame.a_hits - PlayerGame.a_dribble_conts), \
            func.avg((100 * PlayerGame.shots) / (PlayerGame.a_hits - PlayerGame.a_dribble_conts)), \
            func.avg((100 * PlayerGame.a_passes) / (PlayerGame.a_hits - PlayerGame.a_dribble_conts)), \
            func.avg((100 * PlayerGame.assists) / (PlayerGame.a_hits - PlayerGame.a_dribble_conts)), \
            func.avg(PlayerGame.a_turnovers)

        field_list += add_dynamic_fields(['possesion', 'non dribbles',
                                          'shots per hit', 'passes per hit', 'assists per hit', 'turnovers'])

        return stat_list, field_list

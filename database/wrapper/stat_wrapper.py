import json

from database.objects import PlayerGame
from sqlalchemy import func, desc, cast, String
from data import constants
from helpers.dynamic_field_manager import create_and_filter_proto_field, add_dynamic_fields
from replayanalysis.replay_analysis.generated.api import player_pb2


def safe_divide(sql_value):
    return func.greatest(sql_value, 1)


class PlayerStatWrapper:

    def __init__(self):
        self.stats_query, self.field_names = self.get_stats_query()

    def get_wrapped_stats(self, stats):
        zipped_stats = dict()

        for i in range(len(self.field_names)):
            zipped_stats[self.field_names[i].field_name] = stats[i]

        return zipped_stats

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

        stat_list += [
            func.avg(PlayerGame.a_possession),
            func.avg(PlayerGame.a_hits - PlayerGame.a_dribble_conts),  # hits that are not dribbles
            func.avg((100 * PlayerGame.shots) /
                     safe_divide(PlayerGame.a_hits - PlayerGame.a_dribble_conts)),  # Shots per non dribble
            func.avg((100 * PlayerGame.a_passes) /
                     safe_divide(PlayerGame.a_hits - PlayerGame.a_dribble_conts)),  # passes per non dribble
            func.avg((100 * PlayerGame.assists) /
                     safe_divide(PlayerGame.a_hits - PlayerGame.a_dribble_conts)),  # assists per non dribble
            func.avg((100 * PlayerGame.shots + PlayerGame.a_passes + PlayerGame.a_saves + PlayerGame.a_goals) /
                     safe_divide(PlayerGame.a_hits - PlayerGame.a_dribble_conts)),  # useful hit per non dribble
            func.avg(PlayerGame.a_turnovers),
            func.avg(100 * PlayerGame.goals / safe_divide(PlayerGame.a_shots)),
            func.random(), func.avg(func.random()), func.avg(func.random()), func.avg(func.random())]

        field_list += add_dynamic_fields(['possession', 'hits',
                                          'shots/hit', 'passes/hit', 'assists/hit', 'useful/hits',
                                          'turnovers', 'shot %',
                                          'luck1', 'luck2', 'luck3', 'luck4'])

        return stat_list, field_list

    @staticmethod
    def get_stat_spider_charts():
        titles = ['Basic', 'Aggressiveness', 'Chemistry', 'Skill', 'Luck']
        groups = [['score', 'goals', 'assists', 'saves', 'turnovers'],  # basic
                  ['shots', 'possession', 'hits', 'shots/hit'],  # agressive
                  ['passes/hit', 'assists/hit'],  # chemistry
                  ['useful/hits', 'shot %'],  # skill
                  ['luck1', 'luck2', 'luck3', 'luck4']]  # luck

        return [{'title': title, 'group': group} for title, group in zip(titles, groups)]

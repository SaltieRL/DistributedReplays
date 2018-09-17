import sqlalchemy
from carball.generated.api import player_pb2
from sqlalchemy import func, desc, cast, literal

from backend.database.objects import PlayerGame, Game
from backend.database.utils.dynamic_field_manager import create_and_filter_proto_field, add_dynamic_fields
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.utils.checks import get_local_dev
from data import constants


def safe_divide(sql_value):
    return func.greatest(sql_value, 1)


class PlayerStatWrapper:

    def __init__(self, player_wrapper: PlayerWrapper):
        self.stats_query, self.field_names, self.std_query = self.get_stats_query()
        self.player_wrapper = player_wrapper

    def get_wrapped_stats(self, stats):
        zipped_stats = dict()

        for i in range(len(self.field_names)):
            zipped_stats[self.field_names[i].field_name] = stats[i]

        return zipped_stats

    def get_averaged_stats(self, session, id_, total_games, rank=None, page=0):
        stats_query = self.stats_query
        std_query = self.std_query
        games = self.player_wrapper.get_player_games_paginated(session, id_, page=page)
        if len(games) > 0:
            fav_car_str = session.query(PlayerGame.car, func.count(PlayerGame.car).label('c')).filter(
                PlayerGame.player == id_).filter(
                PlayerGame.game != None).group_by(PlayerGame.car).order_by(desc('c')).first()
            print(fav_car_str)
            # car_arr = [g.car for g in games]
            favorite_car = constants.get_car(int(fav_car_str[0]))
            favorite_car_pctg = fav_car_str[1] / total_games
            q = session.query(*stats_query).join(Game).filter(PlayerGame.total_hits > 0).filter(Game.teamsize == 3)
            stds = session.query(*std_query).join(Game).filter(PlayerGame.total_hits > 0).filter(Game.teamsize == 3)
            if rank is not None and not get_local_dev():
                print('Filtering by rank')
                # q_filtered = q.filter(PlayerGame.rank >= rank[3]['tier'] - 1).filter(
                #     PlayerGame.rank <= rank[3]['tier'] + 1)
                # stds = stds.filter(PlayerGame.rank >= rank[3]['tier'] - 1).filter(
                #     PlayerGame.rank <= rank[3]['tier'] + 1)
                try:
                    q_filtered = q.filter(PlayerGame.rank == rank[3]['tier'])
                    stds = stds.filter(PlayerGame.rank == rank[3]['tier'])
                except:
                    q_filtered = q
            else:
                q_filtered = q
            global_stds = stds.first()
            global_stats = q_filtered.first()
            stats = list(q.filter(PlayerGame.player == id_).first())

            for i, s in enumerate(stats):
                player_stat = s
                if player_stat is None:
                    player_stat = 0
                global_stat = global_stats[i]
                global_std = global_stds[i]
                if global_stat is None or global_stat == 0:
                    global_stat = 1
                if global_std is None or global_std == 0:
                    print(self.field_names[i].field_name, 'std is 0')
                if global_std != 1 and global_std > 0:
                    # print(self.field_names[i].field_name, player_stat, global_stat, global_std)
                    stats[i] = float((player_stat - global_stat) / global_std)
                else:
                    stats[i] = float(player_stat / global_stat)

            # Name info

            names = session.query(PlayerGame.name, func.count(PlayerGame.name).label('c')).filter(
                PlayerGame.player == id_).group_by(
                PlayerGame.name).order_by(desc('c'))[:5]
        else:
            favorite_car = "Unknown"
            favorite_car_pctg = 0.0
            stats = [0.0] * len(stats_query)
            names = []
        return games, self.get_wrapped_stats(stats), favorite_car, favorite_car_pctg, names

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
            stat_list.append(field)

        stat_list += [
            PlayerGame.boost_usage,
            PlayerGame.average_speed,
            PlayerGame.possession_time,
            PlayerGame.total_hits - PlayerGame.total_dribble_conts,  # hits that are not dribbles
            (100 * PlayerGame.shots) /
            safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts),  # Shots per non dribble
            (100 * PlayerGame.total_passes) /
            safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts),  # passes per non dribble
            (100 * PlayerGame.assists) /
            safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts),  # assists per non dribble
            (100 * PlayerGame.shots + PlayerGame.total_passes + PlayerGame.total_saves + PlayerGame.total_goals) /
            safe_divide(PlayerGame.total_hits - PlayerGame.total_dribble_conts),  # useful hit per non dribble
            PlayerGame.turnovers,
            func.sum(PlayerGame.goals) / safe_divide(cast(func.sum(PlayerGame.shots), sqlalchemy.Numeric)),
            PlayerGame.total_aerials,
            PlayerGame.time_in_attacking_half,
            PlayerGame.time_in_attacking_third,
            PlayerGame.time_in_defending_half,
            PlayerGame.time_in_defending_third,
            PlayerGame.time_behind_ball,
            PlayerGame.time_in_front_ball,
            func.random(), func.random(), func.random(), func.random()]

        field_list += add_dynamic_fields(['boost usage', 'speed', 'possession', 'hits',
                                          'shots/hit', 'passes/hit', 'assists/hit', 'useful/hits',
                                          'turnovers', 'shot %', 'aerials',
                                          'att 1/2', 'att 1/3', 'def 1/2', 'def 1/3', '< ball', '> ball',
                                          'luck1', 'luck2', 'luck3', 'luck4'])
        avg_list = []
        std_list = []
        for i, s in enumerate(stat_list):
            if field_list[i].field_name in ['shot %']:
                std_list.append(literal(1))
                avg_list.append(s)
            else:
                std_list.append(func.stddev_samp(s))
                avg_list.append(func.avg(s))
        return avg_list, field_list, std_list

    @staticmethod
    def get_stat_spider_charts():
        titles = [  # 'Basic',
            'Aggressiveness', 'Chemistry', 'Skill', 'Tendencies', 'Luck']
        groups = [  # ['score', 'goals', 'assists', 'saves', 'turnovers'],  # basic
            ['shots', 'possession', 'hits', 'shots/hit', 'boost usage', 'speed'],  # agressive
            ['assists', 'passes/hit', 'assists/hit'],  # chemistry
            ['turnovers', 'useful/hits', 'aerials'],  # skill
            ['att 1/3', 'att 1/2', 'def 1/2', 'def 1/3', '< ball', '> ball']]  # ,  # tendencies
        # ['luck1', 'luck2', 'luck3', 'luck4']]  # luck

        return [{'title': title, 'group': group} for title, group in zip(titles, groups)]

    def get_global_stats(self, sess):
        results = {}
        ranks = list(range(20))
        for column, q in zip(self.field_names, self.stats_query):
            column_results = []
            for rank in ranks:
                iq = sess.query(PlayerGame.player,
                                q.label('avg')).filter(
                    PlayerGame.rank == rank).group_by(PlayerGame.player).having(
                    func.count(PlayerGame.player) > 5).subquery()
                result = sess.query(func.avg(iq.c.avg), func.stddev_samp(iq.c.avg)).first()
                column_results.append({'mean': result[0], 'std': result[1]})
            results[column.field_name] = column_results
        return results

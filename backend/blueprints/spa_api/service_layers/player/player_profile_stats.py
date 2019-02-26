from typing import List

from flask import current_app
from sqlalchemy import func, desc, cast, String, literal_column
from sqlalchemy.dialects import postgresql

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import PlayerGame, Game, Player
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.stats.player_stat_wrapper import PlayerStatWrapper
from data.constants.car import get_car

player_wrapper = PlayerWrapper(limit=10)
player_stat_wrapper = PlayerStatWrapper(player_wrapper)


class PlayerInCommonStats:
    def __init__(self, id: str, name: str, count: int):
        self.id = id
        self.name = name
        self.count = count


class PlayerProfileStats:
    def __init__(self, favourite_car: str, car_percentage: float, players_in_common: List[PlayerInCommonStats]):
        self.car = {
            "carName": favourite_car,
            "carPercentage": car_percentage
        }
        self.playersInCommon = [player_in_common.__dict__ for player_in_common in players_in_common]

    @staticmethod
    @with_session
    def create_from_id(id_: str, session=None) -> 'PlayerProfileStats':
        favourite_car, car_percentage = PlayerProfileStats._get_favourite_car(id_, session)
        players_in_common = PlayerProfileStats._get_most_played_with(id_, session)
        return PlayerProfileStats(favourite_car=favourite_car, car_percentage=car_percentage,
                                  players_in_common=players_in_common)

    @staticmethod
    def _get_most_played_with(id_: str, session):
        p = func.unnest(Game.players).label('player')
        players_in_common = []
        result = session.query(p,
                               func.count(Game.players).label('count')).filter(
            Game.players.contains(cast([id_],
                                       postgresql.ARRAY(String)))).group_by('player').order_by(desc('count')).subquery(
            't')
        result = session.query(result, Player.platformname).join(Player,
                                                                 Player.platformid == result.c.player).filter(
            Player.platformid != id_).filter(literal_column('count') > 1)[:3]
        for p in result:
            players_in_common.append(PlayerInCommonStats(name=p[2], count=p[1], id=p[0]))
        return players_in_common

    @staticmethod
    def _get_favourite_car(id_: str, session):

        fav_car_str = session.query(PlayerGame.car, func.count(PlayerGame.car).label('c')) \
            .filter(PlayerGame.player == id_) \
            .filter(PlayerGame.game != None) \
            .group_by(PlayerGame.car) \
            .order_by(desc('c')) \
            .first()

        if fav_car_str is None:
            favourite_car = "Unknown"
            car_percentage = 0.
        else:
            favourite_car = get_car(int(fav_car_str[0]))
            total_games = player_wrapper.get_total_games(session, id_)
            car_percentage = fav_car_str[1] / total_games
        return favourite_car, car_percentage

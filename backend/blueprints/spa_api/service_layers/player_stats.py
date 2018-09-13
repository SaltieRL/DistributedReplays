from flask import current_app
from sqlalchemy import func, desc

from backend.database.objects import PlayerGame
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.stat_wrapper import PlayerStatWrapper
from data import constants

player_wrapper = PlayerWrapper(limit=10)
player_stat_wrapper = PlayerStatWrapper(player_wrapper)


class PlayerProfileStats:
    def __init__(self, favourite_car: str, car_percentage: float):
        self.car = {
            "carName": favourite_car,
            "carPercentage": car_percentage
        }

    @staticmethod
    def create_from_id(id_: str):
        session = current_app.config['db']()

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
            favourite_car = constants.get_car(int(fav_car_str[0]))
            total_games = player_wrapper.get_total_games(session, id_)
            car_percentage = fav_car_str[1] / total_games

        return PlayerProfileStats(favourite_car=favourite_car, car_percentage=car_percentage)

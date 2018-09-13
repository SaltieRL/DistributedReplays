from flask import current_app
from sqlalchemy import func, desc

from backend.blueprints.spa_api.service_layers.player import player_wrapper
from data import constants
from ....database.objects import PlayerGame


class PlayerStats:
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

        return PlayerStats(favourite_car=favourite_car, car_percentage=car_percentage)

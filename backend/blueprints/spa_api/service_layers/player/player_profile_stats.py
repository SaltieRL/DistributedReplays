from typing import List

from sqlalchemy import func, desc, cast, String
from sqlalchemy.dialects import postgresql

from backend.blueprints.spa_api.service_layers.replay.replay_player import Loadout
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.data.constants.car import get_car
from backend.database.objects import PlayerGame, Game, Player
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.stats.player_stat_wrapper import PlayerStatWrapper

player_wrapper = PlayerWrapper(limit=10)
player_stat_wrapper = PlayerStatWrapper(player_wrapper)


class PlayerInCommonStats:
    def __init__(self, id: str, name: str, count: int, avatar: str):
        self.id = id
        self.name = name
        self.count = count
        self.avatar = avatar


class PlayerProfileStats:
    def __init__(self, favourite_car: str, car_percentage: float, players_in_common: List[PlayerInCommonStats],
                 loadout: Loadout):
        self.car = {
            "carName": favourite_car,
            "carPercentage": car_percentage
        }
        self.playersInCommon = [player_in_common.__dict__ for player_in_common in players_in_common]
        self.loadout = loadout.__dict__

    @staticmethod
    @with_session
    def create_from_id(id_: str, session=None) -> 'PlayerProfileStats':
        # favourite_car, car_percentage = PlayerProfileStats._get_favourite_car(id_, session)
        favourite_car = "Unknown"
        car_percentage = 0.0
        players_in_common = PlayerProfileStats._get_most_played_with(id_, session)
        loadout = PlayerProfileStats._get_most_recent_loadout(id_, session)
        return PlayerProfileStats(favourite_car=favourite_car, car_percentage=car_percentage,
                                  players_in_common=players_in_common, loadout=loadout)

    @staticmethod
    def _get_most_played_with(id_: str, session):
        p = func.unnest(Game.players).label('player')
        players_in_common = []
        result = session.query(p,
                               func.count(Game.players).label('count')).filter(
            Game.players.contains(cast([id_],
                                       postgresql.ARRAY(String)))).group_by('player').order_by(desc('count'))
        result = result[1:4]
        for p in result:
            player = session.query(Player).filter(Player.platformid == p[0]).first()
            if player is None or player.platformname == "":
                print("unknown player")
                players_in_common.append(PlayerInCommonStats(name="Unknown", count=p[1], id=p[0], avatar=player.avatar))
            else:
                players_in_common.append(
                    PlayerInCommonStats(name=player.platformname, count=p[1], id=p[0], avatar=player.avatar))

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

    @staticmethod
    def _get_most_recent_loadout(id_: str, session):
        pg = session.query(PlayerGame) \
            .join(Game, PlayerGame.game == Game.hash) \
            .filter(PlayerGame.player == id_) \
            .order_by(desc(PlayerGame.player), desc(Game.match_date)) \
            .first()
        return Loadout.create_from_player_game(pg)

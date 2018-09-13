from typing import List

from flask import current_app
from sqlalchemy import func, desc

from backend.blueprints.steam import get_steam_profile_or_random_response
from backend.database.objects import PlayerGame
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.database.wrapper.stat_wrapper import PlayerStatWrapper

player_wrapper = PlayerWrapper(limit=10)
player_stat_wrapper = PlayerStatWrapper(player_wrapper)


# TODO: Move to service layer folder

class Player:
    def __init__(self, id_: str, name: str, past_names: List[str], avatar_link: str):
        self.name = name
        self.pastNames = past_names
        self.id = id_
        self.profileLink = f"https://steamcommunity.com/id/{id_}/"
        self.platform = "Steam"
        self.avatarLink = avatar_link

    @staticmethod
    def create_from_id(id_: str):
        session = current_app.config['db']()
        names = session.query(PlayerGame.name, func.count(PlayerGame.name).label('c')).filter(
            PlayerGame.player == id_).group_by(
            PlayerGame.name).order_by(desc('c'))[:5]
        steam_profile = get_steam_profile_or_random_response(id_, current_app)['response']

        return Player(id_=id_, name=steam_profile['personaname'], past_names=names,
                      avatar_link=steam_profile['avatarfull'])

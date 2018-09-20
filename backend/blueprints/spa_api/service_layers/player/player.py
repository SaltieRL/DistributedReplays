from typing import List

from flask import current_app
from sqlalchemy import func, desc

from backend.blueprints.steam import get_steam_profile_or_random_response
from backend.database.objects import PlayerGame
from ...errors.errors import PlayerNotFound


class Player:
    def __init__(self, id_: str, name: str, past_names: List[str], profile_link: str, avatar_link: str):
        self.id = id_
        self.name = name
        self.pastNames = past_names
        self.profileLink = profile_link
        self.platform = "Steam"
        self.avatarLink = avatar_link

    @staticmethod
    def create_from_id(id_: str) -> 'Player':
        session = current_app.config['db']()
        names = session.query(PlayerGame.name, func.count(PlayerGame.name).label('c')).filter(
            PlayerGame.player == id_).group_by(
            PlayerGame.name).order_by(desc('c'))[:5]
        try:
            steam_profile = get_steam_profile_or_random_response(id_)['response']['players'][0]
        except TypeError:
            raise PlayerNotFound
        session.close()
        return Player(id_=id_, name=steam_profile['personaname'], past_names=names,
                      profile_link=steam_profile['profileurl'],
                      avatar_link=steam_profile['avatarfull'])

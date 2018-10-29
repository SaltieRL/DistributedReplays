from typing import List, Tuple

from flask import current_app
from sqlalchemy import func, desc

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.blueprints.steam import get_steam_profile_or_random_response
from backend.database.objects import PlayerGame
from ...errors.errors import PlayerNotFound


class Player:
    def __init__(self, id_: str, name: str, past_names: List[Tuple[str, int]], profile_link: str, avatar_link: str):
        self.id = id_
        self.name = name
        self.pastNames = [f"{name} ({count})" for name, count in past_names]
        self.profileLink = profile_link
        self.platform = "Steam"
        self.avatarLink = avatar_link

    @staticmethod
    @with_session
    def create_from_id(id_: str, session=None) -> 'Player':
        names_and_counts: List[Tuple[str, int]] = session.query(PlayerGame.name, func.count(PlayerGame.name).label('c')) \
                                                      .filter(PlayerGame.player == id_) \
                                                      .group_by(PlayerGame.name).order_by(desc('c'))[:5]
        try:
            steam_profile = get_steam_profile_or_random_response(id_)['response']['players'][0]
        except TypeError:
            if len(names_and_counts) > 0:
                return Player(id_=id_, name=names_and_counts[0][0], past_names=names_and_counts, profile_link="",
                              avatar_link="/psynet.jpg" if not id_.startswith(
                                  'b') else "/ai.jpg")
            raise PlayerNotFound
        return Player(id_=id_, name=steam_profile['personaname'], past_names=names_and_counts,
                      profile_link=steam_profile['profileurl'],
                      avatar_link=steam_profile['avatarfull'])

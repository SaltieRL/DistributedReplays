from flask import g

from backend.blueprints.steam import get_steam_profile_or_random_response
from backend.utils.checks import get_local_dev
from ..errors.errors import CalculatedError


class LoggedInUser:
    def __init__(self, name: str, id_: str, avatar_link: str):
        self.name = name
        self.id = id_
        self.avatarLink = avatar_link

    @staticmethod
    def create() -> 'LoggedInUser':
        if get_local_dev() and False:
            mock_steam_profile = get_steam_profile_or_random_response("TESTLOCALUSER")['response']['players'][0]
            name = mock_steam_profile['personaname']
            id_ = mock_steam_profile['steamid']
            avatar_link = mock_steam_profile['avatarfull']
            return LoggedInUser(name, id_, avatar_link)
        if g.user is None:
            raise CalculatedError(404, "User is not logged in.")
        return LoggedInUser(g.user.platformname, g.user.platformid, g.user.avatar)

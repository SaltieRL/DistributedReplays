from flask import g

from backend.blueprints.steam import get_steam_profile_or_random_response
from backend.database.wrapper.tag_wrapper import TagWrapper
from backend.utils.checks import is_local_dev
from ..errors.errors import CalculatedError


def require_user(func):
    def wrapper_require_user(*args, **kwargs):
        if g.user is None:
            raise CalculatedError(404, "User is not logged in.")
        func(*args, **kwargs)
    return wrapper_require_user


class LoggedInUser:
    def __init__(self, name: str, id_: str, avatar_link: str, admin: bool, alpha: bool, beta: bool):
        self.name = name
        self.id = id_
        self.avatarLink = avatar_link
        self.admin = admin
        self.alpha = alpha
        self.beta = beta

    @staticmethod
    def create() -> 'LoggedInUser':
        if is_local_dev():
            mock_steam_profile = get_steam_profile_or_random_response("TESTLOCALUSER")['response']['players'][0]
            name = mock_steam_profile['personaname']
            id_ = mock_steam_profile['steamid']
            avatar_link = mock_steam_profile['avatarfull']
            return LoggedInUser(name, id_, avatar_link, True, True, True)
        if g.user is None:
            raise CalculatedError(404, "User is not logged in.")
        return LoggedInUser(g.user.platformname, g.user.platformid, g.user.avatar, g.admin, g.alpha, g.beta)

    @staticmethod
    @require_user
    def create_tag(name: str):
        TagWrapper.create_tag(g.user.platformid, name)

    @staticmethod
    @require_user
    def rename_tag(old_name: str, new_name: str):
        TagWrapper.rename_tag(g.user.platformid, old_name, new_name)

    @staticmethod
    @require_user
    def get_tags():
        return TagWrapper.get_tags(g.user.platformid)

    @staticmethod
    @require_user
    def remove_tag(name: str):
        TagWrapper.create_tag(g.user.platformid, name)

    @staticmethod
    @require_user
    def get_tag(name: str):
        return TagWrapper.get_tag(g.user.platformid, name)

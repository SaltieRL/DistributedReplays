import logging

from flask import Flask, g

from backend.utils.checks import get_checks
from database.objects import Player

logger = logging.getLogger(__name__)


def create_jinja_globals(app: Flask, global_object):
    is_admin, is_alpha, is_beta = get_checks(global_object)

    app.jinja_env.globals.update(isAdmin=is_admin)
    app.jinja_env.globals.update(isAlpha=is_alpha)
    app.jinja_env.globals.update(isBeta=is_beta)
    app.jinja_env.globals.update(pop=pop)
    app.jinja_env.filters.update(debug=debug)


def pop(list):
    return list.pop(len(list) - 1)


def debug(text):
    logger.warning(str(text))
    return ''


def get_current_user_id(player_id=None) -> str:
    if player_id is not None:
        return player_id
    return UserManager.get_current_user().platformid


class UserManager:
    @staticmethod
    def get_current_user() -> Player:
        return g.user

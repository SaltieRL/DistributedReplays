"""
Safely gets global values from flask in locations where flask values may not exist.
"""
import logging

from database.objects import Player
from utils.logging import ErrorLogger

logger = logging.getLogger(__name__)


class FakeRequest(object):
    path = "task_path"
    method = "backend"


def get_request():
    try:
        from flask import request
        return request
    except:
        return FakeRequest()


def get_current_user_id(player_id=None) -> str:
    if player_id is not None:
        return player_id
    try:
        return UserManager.get_current_user().platformid
    except Exception as e:
        ErrorLogger.log_error(e)
        return ""


class UserManager:
    @staticmethod
    def get_current_user() -> Player:
        try:
            from flask import g
            return g.user
        except:
            return None

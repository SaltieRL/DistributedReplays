"""
Safely gets global values from flask in locations where flask values may not exist.
"""
import logging

import redis
import os

from backend.database.objects import Player
from backend.utils.logger import ErrorLogger

logger = logging.getLogger(__name__)

redis_server = os.getenv("REDIS_HOST", "localhost")
redis_port = os.getenv('REDIS_PORT', "6379")

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
        user = UserManager.get_current_user()
        if user is None:
            return ""
        return user.platformid
    except Exception as e:
        ErrorLogger.log_error(e)
        return ""


class UserManager:
    @staticmethod
    def get_current_user() -> Player or None:
        """
        Tries to get the current user.
        Returns None if there are problems.
        """
        try:
            from flask import g
            return g.user
        except:
            return None


def get_redis() -> redis.Redis:
    """
    Tries to get redis.
    Does a fallback if redis is not able to be grabbed from flask.
    """
    try:
        from flask import current_app
        ###
        print("aca crashea")
        current_app.config['r'] = redis.Redis(host=redis_server, port=redis_port)
        ###
        return current_app.config['r']
    except Exception as e:
        ErrorLogger.log_error(e)
        try:
            from backend.database.startup import lazy_get_redis
            return lazy_get_redis()
        except Exception as e:
            ErrorLogger.log_error(e)

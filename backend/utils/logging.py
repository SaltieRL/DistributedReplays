import logging
from typing import Callable, List

from sqlalchemy import desc, or_

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import ReplayLog, ReplayResult
from backend.utils.checks import is_admin

backup_logger = logging.getLogger(__name__)

logger_callbacks = []


class ErrorLogger:

    @staticmethod
    def add_logging_callback(callback: Callable):
        """
        Adds a callback for logging purposes.
        :param callback: A function that takes in an exception
        """
        logger_callbacks.append(callback)

    @staticmethod
    def log_error(exception: Exception, message: str = None, logger: logging.Logger = backup_logger):
        """
        Logs an exception that occurs in the case that we can not throw an error.
        This will show the stack trace along with the exception.
        Uses a default logger if none is provided.
        :param exception: The exception that occured.
        :param message: An optional message.
        :param logger: A logger to use.  one is provided if nothing is used.
        :return:
        """
        if message is None:
            message = str(exception)
        logger.exception(message)
        try:
            for callback in logger_callbacks:
                callback(exception)
        except Exception as e:
            backup_logger.exception(e)

    @staticmethod
    @with_session
    def log_replay_error(payload, query_params, proto_game=None, session=None):
        replay_uuid = None if 'uuid' not in payload else payload['uuid']
        error_type = None if 'error_type' not in payload else payload['error_type']
        stack = None if 'stack' not in payload else payload['stack']
        game_hash = None
        if proto_game is not None:
            game_hash = proto_game.game_metadata.match_guid
            if game_hash == "":
                game_hash = proto_game.game_metadata.id
        log = ReplayLog(uuid=replay_uuid, result=ReplayResult.ERROR, error_type=error_type,
                        log=stack, params=str(query_params), game=game_hash)
        session.add(log)
        session.commit()

    @staticmethod
    @with_session
    def log_replay(payload, query_params, proto_game=None, session=None):
        replay_uuid = None if 'uuid' not in payload else payload['uuid']
        game_hash = None
        if proto_game is not None:
            game_hash = proto_game.game_metadata.match_guid
            if game_hash == "":
                game_hash = proto_game.game_metadata.id
        log = ReplayLog(uuid=replay_uuid, result=ReplayResult.SUCCESS, error_type="",
                        log="", params=str(query_params), game=game_hash)
        session.add(log)
        session.commit()

    @staticmethod
    @with_session
    def get_logs(page, limit, search, session=None):
        if not is_admin():
            raise CalculatedError(401, "Unauthorized")
        logs = session.query(ReplayLog).order_by(desc(ReplayLog.id))
        if search is not None:
            search = f"%{search}%"
            logs = logs.filter(or_(
                ReplayLog.uuid.like(search),
                ReplayLog.game.like(search),
                ReplayLog.error_type.like(search),
                ReplayLog.log.like(search),
                ReplayLog.params.like(search)
            ))

        return {
            'logs': [
                {
                    'id': log.id,
                    'uuid': log.uuid,
                    'game': log.game,
                    'errorType': log.error_type,
                    'log': log.log,
                    'params': log.params,
                    'result': log.result.value

                } for log in logs[page * limit: (page + 1) * limit]
            ],
            'count': logs.count()
        }

import logging

from flask import g

logger = logging.getLogger(__name__)


def get_local_dev() -> bool:
    try:
        import config
        try:
            api_key = config.RL_API_KEY
            return False
        except:
            return True
    except ImportError:
        return True


def get_checks(global_state=None):
    def globals():
        if global_state is None:
            return g
        return global_state

    local_dev = get_local_dev()

    def is_admin():
        if local_dev:
            return True
        if globals().user is None:
            return False
        return globals().admin

    def is_alpha():
        if is_admin():
            return True
        if globals().user is None:
            return False
        return globals().alpha

    def is_beta():
        if is_admin():
            return True
        if globals().user is None:
            return False
        return is_alpha() or globals().beta

    return is_admin, is_alpha, is_beta

is_admin, is_alpha, is_beta = get_checks()


IS_LOCAL_DEV = get_local_dev()


def is_local_dev():
    return IS_LOCAL_DEV


def ignore_filtering():
    return False


# done in cases where we can't throw but want to make sure it is known an error occurs
def log_error(exception, message=None, logger: logging.Logger = logger):
    if message is None:
        message = str(exception)
    ErrorLogger.log_error(logger, message)


class ErrorLogger:
    @staticmethod
    def log_error(logger, message):
        logger.exception(message)

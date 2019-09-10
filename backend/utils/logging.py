import logging

logger = logging.getLogger(__name__)


# done in cases where we can't throw but want to make sure it is known an error occurs
def log_error(exception, message=None, logger: logging.Logger = logger):
    if message is None:
        message = str(exception)
    ErrorLogger.log_error(logger, message)


class ErrorLogger:
    @staticmethod
    def log_error(logger, message):
        logger.exception(message)
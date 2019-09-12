import logging

backup_logger = logging.getLogger(__name__)


class ErrorLogger:

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

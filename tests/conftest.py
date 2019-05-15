import pytest


@pytest.fixture(autouse=True)
def temp_folder(tmpdir, monkeypatch):

    path = tmpdir.dirname
    return path


@pytest.fixture(autouse=True)
def no_errors_are_logged(request, mocker):
    from backend.utils.checks import ErrorLogger

    def actually_log(logger, message):
        logger.debug(message)
        logger.info(message)
        logger.warn(message)
        logger.error(message)
        logger.exception(message)

    mocker.patch('backend.utils.checks.ErrorLogger.log_error', wraps=actually_log)
    cancel = False

    class Holder:
        def cancel_check(self):
            nonlocal cancel
            cancel = True

        def mock_is_called(self):
            return ErrorLogger.log_error.called

    holder = Holder()

    def check_mock():
        if not cancel:
            assert not holder.mock_is_called(), 'Must not make calls to log errors'
    request.addfinalizer(check_mock)
    return holder

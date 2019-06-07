import pytest

from utils.database_utils import default_player_id


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

        def get_mock(self):
            return ErrorLogger.log_error

    holder = Holder()

    def check_mock():
        if not cancel:
            assert not holder.mock_is_called(), 'Must not make calls to log errors'
    request.addfinalizer(check_mock)
    return holder


@pytest.fixture()
def mock_user(monkeypatch):
    from backend.utils.global_functions import UserManager
    from backend.database.objects import Player

    class MockUser:
        def __init__(self):
            self.user = Player(platformid=default_player_id(), platformname="default")

        def get_fake_user(self) -> Player:
            return self.user

        def set_fake_user(self, user: Player):
            self.user = user

    mock_user = MockUser()

    monkeypatch.setattr(UserManager, 'get_current_user', mock_user)
    return mock_user

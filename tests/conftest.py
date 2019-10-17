import pytest

from tests.utils.database_utils import default_player_id


@pytest.fixture(autouse=True)
def temp_folder(monkeypatch, tmpdir):
    path = tmpdir.dirname

    def get_path():
        return path
    monkeypatch.setattr('tests.utils.location_utils.TestFolderManager.get_internal_default_test_folder_location', get_path)

    return path


@pytest.fixture()
def use_test_paths(monkeypatch, temp_folder):
    class Patcher:
        def patch(self):
            def get_path():
                return temp_folder

            monkeypatch.setattr('backend.utils.file_manager.FileManager.get_default_parse_folder', get_path)

            monkeypatch.setattr('tests.utils.location_utils.TestFolderManager.get_internal_default_test_folder_location', get_path)
    return Patcher()


@pytest.fixture(autouse=True)
def no_errors_are_logged(request, mocker):
    from backend.utils.logger import backup_logger

    def actually_log(exception, message=None, logger=backup_logger):
        output = str(exception) + (message if message is not None else "")
        logger.debug(output)
        logger.info(output)
        logger.warn(output)
        logger.error(output)
        logger.exception(output)

    mocker.patch('backend.utils.logger.ErrorLogger.log_error', wraps=actually_log)
    from backend.utils.logger import ErrorLogger
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
    from backend.database.objects import Player

    class MockUser:
        def __init__(self):
            self.user = Player(platformid=default_player_id(), platformname="default")

        def get_fake_user(self) -> Player:
            return self.user

        def set_fake_user(self, user: Player):
            self.user = user

    mock_user = MockUser()

    monkeypatch.setattr('backend.utils.safe_flask_globals.UserManager.get_current_user', mock_user.get_fake_user)
    return mock_user

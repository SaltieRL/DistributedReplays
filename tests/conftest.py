import pytest

from tests.utils.database_utils import default_player_id
from utils.replay_utils import get_small_replays, parse_replays


@pytest.fixture()
def dynamic_monkey_patcher(monkeypatch):
    class Patcher:
        def patch_object(self, object_to_patch, field_to_patch, value):

            module_str = object_to_patch.__module__
            object_name = object_to_patch.__name__

            full_path = module_str + '.' + object_name + '.' + field_to_patch

            monkeypatch.setattr(full_path, value)

    return Patcher()

@pytest.fixture()
def dynamic_mocker(mocker):
    class Patcher:
        def patch_object(self, object_to_patch, field_to_patch, value_to_wrap=None):

            module_str = object_to_patch.__module__
            object_name = object_to_patch.__name__

            full_path = module_str + '.' + object_name + '.' + field_to_patch

            mocker.patch(full_path, wraps=value_to_wrap)

    return Patcher()


@pytest.fixture(autouse=True)
def temp_folder(tmpdir, dynamic_monkey_patcher):
    path = tmpdir

    def get_path():
        return path

    from tests.utils.location_utils import TestFolderManager
    dynamic_monkey_patcher.patch_object(TestFolderManager, 'get_internal_default_test_folder_location', get_path)

    return path


@pytest.fixture()
def use_test_paths(dynamic_monkey_patcher, temp_folder):
    class Patcher:
        def patch(self):
            def get_path():
                return temp_folder

            from utils.file_manager import FileManager
            dynamic_monkey_patcher.patch_object(FileManager, 'get_default_parse_folder', get_path)

            from utils.location_utils import TestFolderManager
            dynamic_monkey_patcher.patch_object(TestFolderManager, 'get_internal_default_test_folder_location', get_path)

        def get_temp_path(self):
            return temp_folder
    return Patcher()

@pytest.fixture()
def temp_file(tmpdir):
    temp_file = tmpdir.mkdir("sub").join("hello.txt")
    temp_file.write("content")
    return temp_file


@pytest.fixture(autouse=True)
def no_errors_are_logged(request, dynamic_mocker):
    from backend.utils.logger import backup_logger

    def actually_log(exception, message=None, logger=backup_logger):
        output = str(exception) + (message if message is not None else "")
        logger.debug(output)
        logger.info(output)
        logger.warn(output)
        logger.error(output)
        logger.exception(output)
    from backend.utils.logger import ErrorLogger

    dynamic_mocker.patch_object(ErrorLogger, 'log_error', value_to_wrap=actually_log)

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
def mock_user(dynamic_monkey_patcher):
    from backend.database.objects import Player

    class MockUser:
        def __init__(self):
            self.user = Player(platformid=default_player_id(), platformname="default")

        def get_fake_user(self) -> Player:
            return self.user

        def set_fake_user(self, user: Player):
            self.user = user

    mock_user = MockUser()

    from utils.safe_flask_globals import UserManager
    dynamic_monkey_patcher.patch_object(UserManager, 'get_current_user', mock_user.get_fake_user)

    return mock_user


@pytest.fixture(scope='session')
def parse_small_replays():
    """
    Parses a bunch of replays.
    This only happens once per a session
    """
    protos, guids, replay_paths = parse_replays(get_small_replays())

    class Wrapper:
        def get_protos(self):
            return protos
        def get_guids(self):
            return guids
        def get_replay_paths(self):
            return replay_paths

    return Wrapper()

import os
import random

import fakeredis
import pytest
from sqlalchemy import create_engine, inspect
from sqlalchemy.dialects.postgresql.base import PGInspector
from sqlalchemy.orm import sessionmaker
from testing import postgresql

from backend.database.objects import Player
from tests.utils.database_utils import create_initial_mock_database, add_initial_player, empty_database, \
    initialize_db_with_replays
from tests.utils.replay_utils import clear_dir
from tests.utils.test_utils import function_result_creator

"""
#####################################
DATABSE FUNCTIONS
####################################
"""


@pytest.fixture(autouse=True, scope="session")
def postgres_factory():
    """
    Creates an initial fake database for use in unit tests.
    """
    postgres_factory = postgresql.PostgresqlFactory(cache_initialized_db=True)
    return postgres_factory


@pytest.fixture(scope="session")
def postgres_instance(postgres_factory):
    fake_db = postgres_factory()
    return fake_db


@pytest.fixture()
def engine(postgres_instance):
    engine = create_engine(postgres_instance.url())
    from backend.database.objects import DBObjectBase
    DBObjectBase.metadata.create_all(engine)
    return engine


@pytest.fixture()
def session(engine):
    fake_db = sessionmaker(bind=engine)
    add_initial_player(fake_db())
    return fake_db


@pytest.fixture()
def inspector(postgres_instance) -> PGInspector:
    engine = create_engine(postgres_instance.url())
    inspector = inspect(engine)  # type: PGInspector
    return inspector


@pytest.fixture()
def mock_db(fake_db):

    local_alchemy, _ = create_initial_mock_database()

    def constructor():
        return local_alchemy

    class Mocker:
        def __init__(self, starter_instance):
            self.mock_db = starter_instance

        def create_mock_db_instance(self, existing_data=None):
            self.mock_db, _ = create_initial_mock_database(existing_data=existing_data)

        def apply_mock(self):
            from backend.database.startup import EngineStartup
            EngineStartup.startup(replacement=constructor)

    return Mocker(local_alchemy)



@pytest.fixture(autouse=True)
def fake_db(monkeypatch, session, fake_redis):
    """
    Creates an initial fake database for use in unit tests.
    Allows for a replacement mock if a replacement engine is needed.
    :return: the initial instance of the database
    """

    local_alchemy = session

    # add alchemy
    def fake_startup(replacement=None):
        if replacement is not None:
            nonlocal local_alchemy
            local_alchemy = replacement
        return local_alchemy

    def fake_session_instance():
        return local_alchemy()
    monkeypatch.setattr('backend.database.startup.EngineStartup.startup', fake_startup)
    monkeypatch.setattr('backend.database.startup.EngineStartup.get_current_session', fake_session_instance)

    # Add redis
    local_redis = fake_redis

    def fake_redis(replacement=None):
        if replacement is not None:
            nonlocal local_redis
            local_redis = replacement
        return local_redis
    monkeypatch.setattr('backend.database.startup.EngineStartup.get_redis', fake_redis)
    monkeypatch.setattr('backend.database.startup.EngineStartup.get_strict_redis', fake_redis)

    return local_alchemy


@pytest.fixture()
def clean_database(request, postgres_factory):
    def kill_database():
        postgres_factory.clear_cache()
    request.addfinalizer(kill_database)


@pytest.fixture(autouse=True)
def kill_database(request, engine, session, monkeypatch):
    def kill_database():
        empty_database(engine, session)

        from backend.database import startup

        monkeypatch.setattr(startup, 'stored_session', None)
        monkeypatch.setattr(startup, 'stored_redis', None)
        monkeypatch.setattr(startup, 'redis_attempted', False)
    request.addfinalizer(kill_database)


@pytest.fixture(scope="session", autouse=True)
def cleanup(request, postgres_factory):
    """Cleanup a testing directory once we are finished."""
    def cleanup():
        clear_dir()
    request.addfinalizer(cleanup)


@pytest.fixture(autouse=True)
def fake_redis():
    server = fakeredis.FakeServer()
    redis = fakeredis.FakeStrictRedis(server=server)
    return redis

"""
######################
Random tests
######################
"""


@pytest.fixture()
def seeded_random():
    """
    Calls random.seed() with a constant to ensure that random always returns
    the same results.
    """

    random.seed(1234)


@pytest.fixture()
def no_requests(monkeypatch):
    monkeypatch.delattr("requests.sessions.Session.request")


@pytest.fixture()
def gcp(monkeypatch):
    gcp_url = 'http://gcp.google.com'

    def get_url():
        return gcp_url

    def should_go_to_gcp(ignore):
        return True

    from backend.utils.cloud_handler import GCPManager
    monkeypatch.setattr(GCPManager, 'get_gcp_url', get_url)
    monkeypatch.setattr(GCPManager, 'should_go_to_gcp', should_go_to_gcp)

    class GCP:
        def get_url(self):
            return get_url()

    return GCP()

"""
#######################
FAKE DIRECTORIES
######################
"""

# All files should be in the test directory
@pytest.fixture(autouse=True)
def fake_write_location(monkeypatch, temp_folder):

    def get_path():
        return temp_folder

    monkeypatch.setattr('backend.utils.file_manager.FileManager.get_default_parse_folder', get_path)


@pytest.fixture(autouse=True)
def fake_upload_location(monkeypatch, temp_folder):
    monkeypatch.setattr('backend.server_constants.UPLOAD_FOLDER', temp_folder)


@pytest.fixture()
def app():
    from backend.initial_setup import CalculatedServer
    instance = CalculatedServer()
    app = instance.app

    app.testing = True
    return app.test_client()


@pytest.fixture(autouse=True)
def make_celery_testable(monkeypatch):
    monkeypatch.setattr('backend.tasks.celeryconfig.task_always_eager', True, raising=False)
    monkeypatch.setattr('backend.tasks.celeryconfig.task_eager_propagates', True, raising=False)


@pytest.fixture()
def fake_user(dynamic_monkey_patcher):

    fake_user = None

    def get_fake_user():
        return fake_user

    class FakeUser:
        def setUser(self, platformId):
            nonlocal fake_user
            fake_user = Player(platformid=platformId)

    from utils.safe_flask_globals import UserManager
    dynamic_monkey_patcher.patch_object(UserManager, 'get_current_user', get_fake_user)

    return FakeUser()


@pytest.fixture()
def fake_file_locations(dynamic_monkey_patcher, temp_folder):

    def get_replay_func(ext):
        def get_path(replay_id):
            return os.path.join(temp_folder, replay_id + ext)
        return get_path

    from utils.file_manager import FileManager
    dynamic_monkey_patcher.patch_object(FileManager, 'get_replay_path', get_replay_func(REPLAY_EXTENSION))
    dynamic_monkey_patcher.patch_object(FileManager, 'get_proto_path', get_replay_func('.replay.pts'))
    dynamic_monkey_patcher.patch_object(FileManager, 'get_pandas_path', get_replay_func('.replay.gzip'))

    monkeypatch.setattr('backend.utils.file_manager.FileManager.get_replay_path', get_replay_func('.replay'))
    monkeypatch.setattr('backend.utils.file_manager.FileManager.get_proto_path', get_replay_func('.replay.pts'))
    monkeypatch.setattr('backend.utils.file_manager.FileManager.get_pandas_path', get_replay_func('.replay.gzip'))



@pytest.fixture()
def mock_get_proto(monkeypatch):

    proto_set, get_proto = function_result_creator()

    def wrapped(replay_id):
        return get_proto()

    monkeypatch.setattr('backend.utils.file_manager.FileManager.get_proto', wrapped)
    return proto_set

@pytest.fixture()
def mock_get_replay(monkeypatch):

    replay_set, get_replay = function_result_creator()

    def wrapped(replay_id):
        return get_replay()

    monkeypatch.setattr('backend.utils.file_manager.FileManager.get_replay', wrapped)
    return replay_set


@pytest.fixture()
def mock_get_pandas(monkeypatch):

    pandas_set, get_pandas = function_result_creator()

    def wrapped(replay_id):
        return get_pandas()

    monkeypatch.setattr('backend.utils.file_manager.FileManager.get_pandas', wrapped)
    return pandas_set


@pytest.fixture()
def initialize_database(temp_folder):
    session, protos, ids = initialize_db_with_replays(['3_KICKOFFS_4_SHOTS.replay'])

    class wrapper:
        def get_session(self):
            return session
        def get_protos(self):
            return protos
        def get_ids(self):
            return ids

    return wrapper()

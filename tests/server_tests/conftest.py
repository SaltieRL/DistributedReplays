import random
from unittest import mock

import fakeredis
import pytest
from alchemy_mock.mocking import UnifiedAlchemyMagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from testing import postgresql

from tests.utils import get_test_folder, clear_dir

"""
#####################################
DATABSE FUNCTIONS
####################################
"""


def create_initial_mock_database():
    from backend.database.objects import Group
    from backend.server_constants import SERVER_PERMISSION_GROUPS

    initial_data = []
    for index, group in enumerate(SERVER_PERMISSION_GROUPS):
        initial_data.append(
            (
                [mock.call.query(Group),
                 mock.call.filter(Group.name == group)],
                [Group(id=index, name=group)]
            )
        )
    return UnifiedAlchemyMagicMock(data=initial_data), initial_data


@pytest.fixture(autouse=True, scope="session")
def postgres_factory():
    """
    Creates an initial fake database for use in unit tests.
    """
    postgres_factory = postgresql.PostgresqlFactory(cache_initialized_db=True)
    fake_db = postgresql.Postgresql()
    return postgres_factory


@pytest.fixture(autouse=True)
def postgres(postgres_factory):
    fake_db = postgres_factory()
    return fake_db


@pytest.fixture(autouse=True)
def session(postgres):
    engine = create_engine(postgres.url())
    fake_db = sessionmaker(bind=engine)
    return fake_db


@pytest.fixture(autouse=True)
def mock_db(monkeypatch, session, fake_redis):
    """
    Creates an initial fake database for use in unit tests.
    Allows for a replacement mock if a replacement engine is needed.
    :return: the initial instance of the database
    """
    from backend.database.startup import EngineStartup

    # local_instance = UnifiedAlchemyMagicMock(data=create_initial_mock_database_data())
    local_alchemy = postgres

    # add alchemy
    def fake_startup(replacement=None):
        if replacement is not None:
            nonlocal local_alchemy
            local_alchemy = replacement
        return local_alchemy
    monkeypatch.setattr(EngineStartup, 'startup', fake_startup)

    # Add redis
    local_redis = fake_redis

    def fake_redis(replacement=None):
        if replacement is not None:
            nonlocal local_redis
            local_redis = replacement
        return local_redis
    monkeypatch.setattr(EngineStartup, 'get_redis', fake_startup)
    monkeypatch.setattr(EngineStartup, 'get_strict_redis', fake_startup)

    return local_alchemy


@pytest.fixture(autouse=True)
def clean_database(request, postgres, postgres_factory, monkeypatch):
    def kill_database():
        postgres.stop()
        postgres_factory.clear_cache()

        from backend.database import startup

        monkeypatch.setattr(startup, 'stored_session', None)
        monkeypatch.setattr(startup, 'stored_redis', None)
    request.addfinalizer(kill_database)


@pytest.fixture(scope="session", autouse=True)
def cleanup(request, postgres_factory, monkeypatch):
    """Cleanup a testing directory once we are finished."""
    def kill_database():
        clear_dir()
    request.addfinalizer(kill_database)


@pytest.fixture(autouse=True)
def fake_redis():
    redis = fakeredis.FakeServer()
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

"""
#######################
FAKE DIRECTORIES
######################
"""

# All files should be in the test directory
@pytest.fixture(autouse=True)
def fake_write_location(monkeypatch):
    from backend.tasks import utils

    monkeypatch.setattr(utils, 'DEFAULT_PARSED_FOLDER', get_test_folder())


@pytest.fixture(autouse=True)
def fake_upload_location(monkeypatch):
    from backend import server_constants

    monkeypatch.setattr(server_constants, 'UPLOAD_FOLDER', get_test_folder())


@pytest.fixture(scope='session')
def app():
    from RLBotServer import app

    app.testing = True
    return app.test_client()


"""
@pytest.fixture(autouse=True)
def make_celery_testable(monkeypatch):
    from backend.tasks import celeryconfig
    monkeypatch.setattr(celeryconfig, 'task_always_eager', True, raising=False)
    monkeypatch.setattr(celeryconfig, 'task_eager_propagates', True, raising=False)
"""
import random
from unittest import mock

import pytest
from alchemy_mock.mocking import UnifiedAlchemyMagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from testing import postgresql

from tests.utils import get_test_folder


@pytest.fixture(scope="function")
def seeded_random():
    """
    Calls random.seed() with a constant to ensure that random always returns
    the same results.
    """

    random.seed(1234)


@pytest.fixture()
def no_requests(monkeypatch):
    monkeypatch.delattr("requests.sessions.Session.request")


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


@pytest.fixture(autouse=True)
def mock_alchemy(monkeypatch):
    """
    Creates an initial fake database for use in unit tests.
    Allows for a replacement mock if a replacement engine is needed.
    :return: the initial instance of the database
    """
    from backend.database.startup import EngineStartup
    fake_db = postgresql.Postgresql()
    engine = create_engine(postgresql.url())
    local_instance = sessionmaker(bind=engine)

    # local_instance = UnifiedAlchemyMagicMock(data=create_initial_mock_database_data())

    def fake_startup(replacement=None):
        if replacement is not None:
            nonlocal local_instance
            local_instance = replacement
        return local_instance

    monkeypatch.setattr(EngineStartup, 'startup', fake_startup)

    yield local_instance

    fake_db.stop()



# All files should be in the test directory
@pytest.fixture(autouse=True)
def fake_write_location(monkeypatch):
    from backend.tasks import utils

    monkeypatch.setattr(utils, 'DEFAULT_PARSED_FOLDER', get_test_folder())

@pytest.fixture(autouse=True)
def fake_upload_location(monkeypatch):
    from backend import server_constants

    monkeypatch.setattr(server_constants, 'UPLOAD_FOLDER', get_test_folder())

"""
@pytest.fixture(autouse=True)
def make_celery_testable(monkeypatch):
    from backend.tasks import celeryconfig
    monkeypatch.setattr(celeryconfig, 'task_always_eager', True, raising=False)
    monkeypatch.setattr(celeryconfig, 'task_eager_propagates', True, raising=False)
"""
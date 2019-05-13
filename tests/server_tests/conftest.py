import pytest
from alchemy_mock.mocking import AlchemyMagicMock


from tests.utils import get_test_folder


@pytest.fixture()
def no_requests(monkeypatch):
    monkeypatch.delattr("requests.sessions.Session.request")


@pytest.fixture(autouse=True)
def mock_alchemy(monkeypatch):
    from backend.database.startup import EngineStartup

    local_instance = AlchemyMagicMock()
    def fake_startup():
        return local_instance

    monkeypatch.setattr(EngineStartup, 'startup', fake_startup)
    return local_instance


# All files should be in the test directory
@pytest.fixture(autouse=True)
def fake_folder_location(monkeypatch):
    from backend.tasks import utils

    monkeypatch.setattr(utils, 'DEFAULT_PARSED_FOLDER', get_test_folder())

"""
@pytest.fixture(autouse=True)
def make_celery_testable(monkeypatch):
    from backend.tasks import celeryconfig
    monkeypatch.setattr(celeryconfig, 'task_always_eager', True, raising=False)
    monkeypatch.setattr(celeryconfig, 'task_eager_propagates', True, raising=False)
"""
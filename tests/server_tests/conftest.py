import pytest
from alchemy_mock.mocking import AlchemyMagicMock


"""
@pytest.fixture(autouse=True)
def no_requests(monkeypatch):
    monkeypatch.delattr("requests.sessions.Session.request")
"""

@pytest.fixture(autouse=True)
def mock_alchemy(monkeypatch):
    from backend.database.startup import EngineStartup
    print('mocking database')

    local_instance = AlchemyMagicMock()
    def fake_startup():
        return local_instance

    monkeypatch.setattr(EngineStartup, 'startup', fake_startup)
    return local_instance

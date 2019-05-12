import pytest
from alchemy_mock.mocking import AlchemyMagicMock


@pytest.fixture(autouse=True)
def no_requests(monkeypatch):
    monkeypatch.delattr("requests.sessions.Session.request")


@pytest.fixture(autouse=True)
def mock_alchemy(monkeypatch):
    def fake_startup():
        return AlchemyMagicMock()

    monkeypatch.setattr('backend.database.startup', 'startup', fake_startup)

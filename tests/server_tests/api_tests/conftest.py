import pytest


@pytest.fixture()
def test_client():
    from RLBotServer import app

    app.testing = True
    return app.test_client()

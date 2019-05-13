import pytest


@pytest.fixture()
def app():
    from RLBotServer import app

    app.testing = True
    return app.test_client()

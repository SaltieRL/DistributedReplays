import pytest

from backend.database.startup import EngineStartup
from tests.utils.database_utils import empty_database


@pytest.fixture(autouse=True, scope="class")
def kill_database(request):
    def kill_database():
        engine, session = EngineStartup.login_db()
        empty_database(engine, session)

    request.addfinalizer(kill_database)

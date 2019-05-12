import pytest

from tests.utils import get_test_folder


@pytest.fixture(autouse=True)
def mock_alchemy(monkeypatch):
    from backend.tasks import celery_tasks
    from backend.tasks.celery_tasks import add_replay_parse_task
    print('mocking database')

    def fake_celery_task(*args, **kwargs):
        return add_replay_parse_task(*args, **{**kwargs, **{"custom_file_location", get_test_folder()}})

    monkeypatch.setattr(celery_tasks, 'add_replay_parse_task', fake_celery_task)

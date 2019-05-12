import unittest
from unittest.mock import patch

from requests import Request
from werkzeug.datastructures import FileStorage

from RLBotServer import app
from tests.utils import get_complex_replay_list, download_replay_discord

LOCAL_URL = 'http://localhost:8000'


class RunningServerTest(unittest.TestCase):
    replay_status = []

    def setUp(self) -> None:
        self.context = app.test_client()

    @patch('backend.tasks.celeryconfig.CELERY_ALWAYS_EAGER', True, create=True)
    def test_replay_no_server_upload(self):
        for replay_url in get_complex_replay_list():
            print('Testing:', replay_url)
            f = download_replay_discord(replay_url)
            file_storage = FileStorage(stream=f, filename='replays')
            response = self.context.post('/api/upload', data={'replays':(file_storage, file_storage)},
                                         buffered=True, content_type="multipart/form-data")
            print(response)


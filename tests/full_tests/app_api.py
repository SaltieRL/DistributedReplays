import io
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
            # create your request like you normally would for upload
            r = Request('POST', LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', io.BytesIO(f))})

            # build it
            prepped = r.prepare()

            # extract data needed for content
            content_data = list(prepped.headers._store.items())
            content_length = content_data[0][1][1]
            content_type = content_data[1][1][1]

            # add the body as an input stream and use the existing values
            response = self.context.post('/api/upload', input_stream=io.BytesIO(prepped.body),
                                         content_length=content_length, content_type=content_type)

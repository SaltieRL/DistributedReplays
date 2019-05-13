import io
from unittest.mock import patch

import pytest
from requests import Request

from backend.database.startup import lazy_startup
from tests.utils import get_complex_replay_list, download_replay_discord

LOCAL_URL = 'http://localhost:8000'

@pytest.mark.usefixtures('test_client')
class Test_upload_file:
    replay_status = []


    @patch('backend.tasks.celeryconfig.task_always_eager', True, create=True)
    @patch('backend.tasks.celeryconfig.task_eager_propagates', True, create=True)
    def test_replay_basic_server_upload(self, test_client):
        replay_url = get_complex_replay_list()[0]
        print('Testing:', replay_url)
        f = download_replay_discord(replay_url)
        # create your request like you normally would for upload
        r = Request('POST', LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', io.BytesIO(f))})

        response = test_client.send(r)

        assert(response.status_code == 202)

        fake_alchemy = lazy_startup()

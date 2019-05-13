import io
from unittest.mock import patch

import pytest
from requests import Request

from tests.utils import get_complex_replay_list, download_replay_discord

LOCAL_URL = 'http://localhost:8000'

@pytest.mark.usefixtures('test_client')
class Test_upload_file:
    replay_status = []


    @patch('backend.tasks.celeryconfig.task_always_eager', True, create=True)
    @patch('backend.tasks.celeryconfig.task_eager_propagates', True, create=True)
    def test_replay_no_server_upload(self, test_client):
        replay_url = get_complex_replay_list()[0]
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
        response = test_client.post('/api/upload', input_stream=io.BytesIO(prepped.body),
                                     content_length=content_length, content_type=content_type)

        assert(response.status_code == 202)

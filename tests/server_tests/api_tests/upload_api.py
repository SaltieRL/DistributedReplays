import io

import pytest
from requests import Request

from backend.database.objects import Game, Player
from backend.database.startup import get_current_session
from tests.utils import get_complex_replay_list, download_replay_discord

LOCAL_URL = 'http://localhost:8000'

@pytest.mark.usefixtures('test_client')
class Test_upload_file:
    replay_status = []

    def test_replay_basic_server_upload(self, test_client, clean_database):
        replay_url = get_complex_replay_list()[0]
        print('Testing:', replay_url)
        f = download_replay_discord(replay_url)
        # create your request like you normally would for upload
        r = Request('POST', LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', io.BytesIO(f))})

        response = test_client.send(r)

        assert(response.status_code == 202)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')

        assert(game.name == '3 kickoffs 4 shots')

        player = fake_session.query(Player).first()
        print(player)

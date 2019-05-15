from datetime import datetime
import io
from requests import Request

from backend.database.objects import Game, GameVisibilitySetting
from backend.database.startup import get_current_session
from tests.utils.database_utils import default_player_id
from tests.utils.replay_utils import get_complex_replay_list, download_replay_discord

LOCAL_URL = 'http://localhost:8000'


class Test_upload_file:
    replay_status = []

    def setup_method(self):
        replay_url = get_complex_replay_list()[0]
        f = download_replay_discord(replay_url)
        self.file = f
        self.stream = io.BytesIO(self.file)

    def test_replay_basic_server_upload_private_replay(self, test_client):
        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game==None)
        timestamp = int(datetime.timestamp(datetime.utcnow()))

        params = {'player_id': default_player_id(), 'visibility': GameVisibilitySetting.PRIVATE.name,
                  'release_date': str(timestamp)}
        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)}, params=params)

        response = test_client.send(r)

        assert(response.status_code == 202)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')

    def test_replay_basic_server_upload_private_replay_invalid_release_date(self, test_client):
        params = {'player_id': default_player_id(), 'visibility': GameVisibilitySetting.PRIVATE,
                  'release_date': 'TODAY'}
        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)}, params=params)

        response = test_client.send(r)

        assert(response.status_code == 400)

    def test_replay_basic_server_upload_private_replay_no_player(self, test_client):
        params = {'visibility': GameVisibilitySetting.PRIVATE}
        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)}, params=params)

        response = test_client.send(r)

        assert(response.status_code == 400)

    def test_replay_basic_server_upload_private_replay_missing_player(self, test_client):
        params = {'player_id': 'invalid_id', 'visibility': GameVisibilitySetting.PRIVATE}
        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)}, params=params)

        response = test_client.send(r)

        assert(response.status_code == 400)

    def test_replay_basic_server_upload_private_replay_new_player_in_game(self, test_client):
        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game==None)
        params = {'player_id': '70DDECEA4653AC55EA77DBA0DB497995', 'visibility': GameVisibilitySetting.PRIVATE}
        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)}, params=params)

        response = test_client.send(r)

        assert(response.status_code == 202)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')

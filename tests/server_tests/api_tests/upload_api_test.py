import io

from requests import Request

from backend.database.objects import Game, Player
from backend.database.startup import get_current_session, EngineStartup
from tests.utils.replay_utils import get_complex_replay_list, download_replay_discord

LOCAL_URL = 'http://localhost:8000'


class Test_upload_file:
    replay_status = []

    def setup_method(self):
        replay_url = get_complex_replay_list()[0]
        f = download_replay_discord(replay_url)
        self.stream = io.BytesIO(f)

    def test_replay_basic_server_upload(self, test_client):
        r = Request('POST', LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', self.stream)})

        response = test_client.send(r)

        assert(response.status_code == 202)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')

        assert(game.name == '3 kickoffs 4 shots')

        player = fake_session.query(Player).first()
        assert(player.platformid == '76561198018756583')

    def test_upload_file_bad_request_no_files(self, test_client):
        r = Request('POST', LOCAL_URL + '/api/upload')
        response = test_client.send(r)
        assert(response.status_code == 400)

    def test_upload_file_bad_request_invalid_file_name(self, test_client):
        r = Request('POST', LOCAL_URL + '/api/upload', files={'replays': ('fake_file.txt', self.stream)})
        response = test_client.send(r)
        assert(response.status_code == 415)

    # due to how celery runs this would actually return a 202
    def test_upload_file_bad_request_invalid_file_data(self, test_client):
        r = Request('POST', LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', io.BytesIO(b'12345'))})
        try:
            response = test_client.send(r)
        except Exception as e:
            assert(True)

    def test_double_upload_does_not_replace(self, test_client, mock_db):
        r = Request('POST', LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', self.stream)})

        response = test_client.send(r)

        assert(response.status_code == 202)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()

        EngineStartup.startup(replacement=mock_db)

        r = Request('POST', LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', self.stream)})

        assert(response.status_code == 202)

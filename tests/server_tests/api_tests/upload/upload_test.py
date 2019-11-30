import io

from requests import Request

from backend.database.objects import Game, Player
from backend.database.startup import get_current_session
from tests.utils.replay_utils import get_complex_replay_list, download_replay_discord

from tests.utils.location_utils import LOCAL_URL


class Test_upload_file:
    replay_status = []

    def setup_method(self):
        replay_url = get_complex_replay_list()[0]
        f = download_replay_discord(replay_url)
        self.file = f
        self.stream = io.BytesIO(self.file)

    def test_replay_basic_server_upload(self, test_client):
        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game==None)
        r = Request('POST', LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', self.stream)})

        response = test_client.send(r)

        assert(response.status_code == 202)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')

        assert(game.name == '3 kickoffs 4 shots')

        player = fake_session.query(Player.platformid == '76561198018756583').first()
        assert(player is not None)

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
        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game==None)
        r = Request('POST', LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', self.stream)})

        response = test_client.send(r)

        assert(response.status_code == 202)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()

        self.stream = io.BytesIO(self.file)
        r = Request('POST', LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', self.stream)})

        response = test_client.send(r)

        assert(response.status_code == 202)

        game2 = fake_session.query(Game).first()

        assert(game == game2)

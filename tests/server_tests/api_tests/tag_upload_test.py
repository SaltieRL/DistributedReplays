import io

from requests import Request

from backend.database.objects import Game, Player
from backend.database.startup import get_current_session, EngineStartup, startup
from tests.utils.replay_utils import get_complex_replay_list, download_replay_discord
from tests.utils.database_utils import default_player_id

LOCAL_URL = 'http://localhost:8000'

TAG_NAME = 'FAKE_TAG'


class Test_upload_file_with_tags:

    replay_status = []

    def setup_method(self):
        replay_url = get_complex_replay_list()[0]
        f = download_replay_discord(replay_url)
        self.file = f
        self.stream = io.BytesIO(self.file)

    def test_replay_basic_server_upload_with_tag(self, test_client):
        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game==None)
        params = {'player_id': default_player_id(), 'tags': TAG_NAME}
        r = Request('POST', LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', self.stream)},
                    params=params)

        response = test_client.send(r)

        assert(response.status_code == 202)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')

        assert(game.name == '3 kickoffs 4 shots')
        assert(len(game.tags) == 1)
        assert(game.tags[0].name == TAG_NAME)
        assert(game.tags[0].owner == default_player_id())
        assert(game.tags[0].games[0] == game)

        player = fake_session.query(Player.platformid == '76561198018756583').first()
        assert(player is not None)

    def test_replay_basic_server_upload_tag_replay_no_player(self, test_client):
        params = {'tags': TAG_NAME}
        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)}, params=params)

        response = test_client.send(r)

        assert(response.status_code == 400)

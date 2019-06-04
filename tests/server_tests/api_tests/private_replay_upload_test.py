import time
from datetime import datetime
import io
from requests import Request

from backend.database.objects import Game, GameVisibilitySetting, GameVisibility, PlayerGame, Player
from backend.database.startup import get_current_session
from backend.utils.time_related import hour_rounder
from blueprints.spa_api.errors.errors import MissingQueryParams, InvalidQueryParamFormat
from blueprints.spa_api.utils.query_param_definitions import visibility_params
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
        game = get_current_session().query(Game).filter(Game.hash == '70DDECEA4653AC55EA77DBA0DB497995').all()
        assert len(game) == 0
        date = datetime.utcnow()
        timestamp = int(datetime.timestamp(date))

        params = {'player_id': default_player_id(), 'visibility': GameVisibilitySetting.PRIVATE.name,
                  'release_date': str(timestamp)}
        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)}, params=params)

        response = test_client.send(r)

        assert(response.status_code == 202)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')
        assert(game.visibility == GameVisibilitySetting.PRIVATE)

        game_visiblity = fake_session.query(GameVisibility).first()
        assert(game_visiblity.game == game.hash)
        assert(game_visiblity.player == default_player_id())
        assert(game_visiblity.visibility == GameVisibilitySetting.PRIVATE)
        assert(game_visiblity.release_date == hour_rounder(date))

    def test_setting_visibility_fails_if_replay_exists(self, test_client, no_errors_are_logged):
        no_errors_are_logged.cancel_check()
        date = datetime.utcnow()
        timestamp = int(datetime.timestamp(date))

        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)})

        response = test_client.send(r)

        assert(response.status_code == 202)
        time.sleep(1)

        params = {'player_id': default_player_id(), 'visibility': GameVisibilitySetting.PRIVATE.name,
                  'release_date': str(timestamp)}
        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', io.BytesIO(self.file))}, params=params)

        response = test_client.send(r)

        assert(response.status_code == 202)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')
        assert(game.visibility == GameVisibilitySetting.DEFAULT)

        game_visiblity = fake_session.query(GameVisibility).first()
        assert(game_visiblity is None)
        assert(no_errors_are_logged.mock_is_called())

    def test_replay_basic_server_upload_private_replay_invalid_release_date(self, test_client):
        params = {'player_id': default_player_id(), 'visibility': GameVisibilitySetting.PRIVATE.name,
                  'release_date': 'TODAY'}
        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)}, params=params)

        response = test_client.send(r)

        assert(response.status_code == 400)

        data = response.json['message']
        assert(str(data) == InvalidQueryParamFormat(visibility_params[0], 'TODAY').message)

    def test_replay_basic_server_upload_private_replay_no_player(self, test_client):
        params = {'visibility': GameVisibilitySetting.PRIVATE.name}
        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)}, params=params)

        response = test_client.send(r)

        assert(response.status_code == 400)

        data = response.json['message']
        assert(str(data) == MissingQueryParams(['player_id']).message)


    def test_replay_basic_server_upload_private_replay_missing_player(self, test_client, no_errors_are_logged):
        no_errors_are_logged.cancel_check()
        params = {'player_id': 'invalid_id', 'visibility': GameVisibilitySetting.PRIVATE.name}
        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)}, params=params)

        response = test_client.send(r)

        assert(response.status_code == 202)

        assert(no_errors_are_logged.mock_is_called())

    def test_replay_basic_server_upload_private_replay_new_player_in_game(self, test_client):
        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game==None)
        params = {'player_id': '76561198018756583', 'visibility': GameVisibilitySetting.PRIVATE.name}
        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)}, params=params)

        response = test_client.send(r)

        assert(response.status_code == 202)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')
        assert(game.visibility == GameVisibilitySetting.PRIVATE)

        game_visiblity = fake_session.query(GameVisibility).first()
        assert(game_visiblity.game == game.hash)
        assert(game_visiblity.player == '76561198018756583')
        assert(game_visiblity.visibility == GameVisibilitySetting.PRIVATE)
        assert(game_visiblity.release_date == datetime.max)

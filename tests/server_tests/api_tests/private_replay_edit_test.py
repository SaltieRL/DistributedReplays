
import io

from requests import Request

from backend.database.objects import Game, GameVisibilitySetting, GameVisibility
from backend.database.startup import get_current_session
from tests.utils.database_utils import default_player_id
from tests.utils.replay_utils import get_complex_replay_list, download_replay_discord

from tests.utils.location_utils import LOCAL_URL


class Test_edit_private_replay:
    replay_status = []

    def setup_method(self):
        replay_url = get_complex_replay_list()[0]
        f = download_replay_discord(replay_url)
        self.file = f
        self.stream = io.BytesIO(self.file)

    def test_replay_edit_private_replay(self, test_client, mock_user):
        mock_user.set_user_id('76561198018756583')
        mock_user.logout()
        game = get_current_session().query(Game).first()
        assert game is None

        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)})

        response = test_client.send(r)

        assert(response.status_code == 202)

        api_url = '/api/replay/70DDECEA4653AC55EA77DBA0DB497995/visibility/' + GameVisibilitySetting.PRIVATE.name
        r = Request('PUT', LOCAL_URL + api_url)

        mock_user.login()

        response = test_client.send(r)

        assert(response.status_code == 200)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')
        assert(game.visibility == GameVisibilitySetting.PRIVATE)

        game_visiblity = fake_session.query(GameVisibility).first()
        assert(game_visiblity.game == game.hash)
        assert(game_visiblity.player == '76561198018756583')
        assert(game_visiblity.visibility == GameVisibilitySetting.PRIVATE)


    def test_replay_edit_private_replay_no_permission(self, test_client, mock_user):
        mock_user.logout()
        game = get_current_session().query(Game).first()
        assert game is None

        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)})

        response = test_client.send(r)

        assert(response.status_code == 202)

        api_url = '/api/replay/70DDECEA4653AC55EA77DBA0DB497995/visibility/' + GameVisibilitySetting.PRIVATE.name
        r = Request('PUT', LOCAL_URL + api_url)

        mock_user.login()

        response = test_client.send(r)

        assert(response.status_code == 404)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')
        assert(game.visibility == GameVisibilitySetting.DEFAULT)

        game_visiblity = fake_session.query(GameVisibility).first()
        assert(game_visiblity is None)


    def test_replay_edit_private_replay_twice(self, test_client, mock_user):
        mock_user.logout()
        game = get_current_session().query(Game).first()
        assert game is None

        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)})

        response = test_client.send(r)

        assert(response.status_code == 202)

        api_url = '/api/replay/70DDECEA4653AC55EA77DBA0DB497995/visibility/' + GameVisibilitySetting.PRIVATE.name
        r = Request('PUT', LOCAL_URL + api_url)

        mock_user.set_user_id('76561198018756583')
        mock_user.login()

        response = test_client.send(r)

        assert(response.status_code == 200)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')
        assert(game.visibility == GameVisibilitySetting.PRIVATE)

        game_visiblity = fake_session.query(GameVisibility).first()
        assert(game_visiblity.game == game.hash)
        assert(game_visiblity.player == '76561198018756583')
        assert(game_visiblity.visibility == GameVisibilitySetting.PRIVATE)


        api_url = '/api/replay/70DDECEA4653AC55EA77DBA0DB497995/visibility/' + GameVisibilitySetting.PUBLIC.name
        r = Request('PUT', LOCAL_URL + api_url)

        mock_user.set_user_id('76561198018756583')

        response = test_client.send(r)

        assert(response.status_code == 200)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')
        assert(game.visibility == GameVisibilitySetting.PUBLIC)

        game_visiblity = fake_session.query(GameVisibility).first()
        assert(game_visiblity.game == game.hash)
        assert(game_visiblity.player == '76561198018756583')
        assert(game_visiblity.visibility == GameVisibilitySetting.PUBLIC)

import base64
import io
import zlib

from requests import Request

from backend.database.objects import Game, Player, Tag, GameVisibilitySetting
from backend.database.startup import get_current_session
from backend.blueprints.spa_api.errors.errors import MismatchedQueryParams
from tests.utils.replay_utils import get_complex_replay_list, download_replay_discord, write_proto_pandas_to_file, \
    get_test_file
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
        assert game is None
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

    def test_replay_basic_server_upload_with_multiple_tags(self, test_client):
        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert game is None
        params = {'player_id': default_player_id(), 'tags': [TAG_NAME, TAG_NAME + "hello"]}
        r = Request('POST', LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', self.stream)},
                    params=params)

        response = test_client.send(r)

        assert(response.status_code == 202)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')

        assert(game.name == '3 kickoffs 4 shots')
        assert(len(game.tags) == 2)
        assert(game.tags[0].name == TAG_NAME)
        assert(game.tags[0].owner == default_player_id())
        assert(game.tags[0].games[0] == game)

        assert(game.tags[1].name == (TAG_NAME + "hello"))

        player = fake_session.query(Player.platformid == '76561198018756583').first()
        assert(player is not None)

    def test_replay_basic_server_upload_with_duplicate_tags(self, test_client):
        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game==None)
        params = {'player_id': default_player_id(), 'tags': [TAG_NAME, TAG_NAME]}
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

    def test_invalid_tag_length(self, test_client):
        params = {'tag_ids': [TAG_NAME, TAG_NAME + "2"], 'private_tag_keys': ['key1'], "player_id": "10"}
        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)}, params=params)

        response = test_client.send(r)

        assert(response.status_code == 400)
        data = response.json['message']
        assert(str(data) == MismatchedQueryParams('tag_ids', 'private_tag_keys', 2, 1).message)

    def test_tag_creation_private_key(self, test_client, mock_user):
        fake_session = get_current_session()
        params = {'private_key': 'fake_private_key'}
        r = Request('PUT', LOCAL_URL + '/api/tag/TAG',
                    params=params)

        response = test_client.send(r)

        assert(response.status_code == 201)
        data = response.json
        assert data['name'] == 'TAG'
        assert data['owner_id'] == default_player_id()

        tag = fake_session.query(Tag).first()
        assert tag.name == 'TAG'
        assert tag.owner == default_player_id()
        assert tag.private_id == 'fake_private_key'

        r = Request('GET', LOCAL_URL + '/api/tag/TAG/private_key')

        response = test_client.send(r)
        assert(response.status_code == 200)
        assert response.json == 'fake_private_key'

    def test_tag_creation_no_private_key(self, test_client, mock_user):
        fake_session = get_current_session()
        r = Request('PUT', LOCAL_URL + '/api/tag/TAG')

        response = test_client.send(r)

        assert(response.status_code == 201)
        data = response.json
        assert data['name'] == 'TAG'
        assert data['owner_id'] == default_player_id()

        tag = fake_session.query(Tag).first()
        assert tag.name == 'TAG'
        assert tag.owner == default_player_id()
        assert tag.private_id is None

        r = Request('GET', LOCAL_URL + '/api/tag/TAG/private_key')

        response = test_client.send(r)
        assert(response.status_code == 404)

    def test_replay_basic_server_upload_with_private_tags(self, test_client, mock_user):
        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game==None)

        params = {'private_key': 'fake_private_key'}
        r = Request('PUT', LOCAL_URL + '/api/tag/' + TAG_NAME,
                    params=params)
        response = test_client.send(r)

        assert(response.status_code == 201)

        tag = fake_session.query(Tag).first()

        params = {'tag_ids': [str(tag.id)], 'private_tag_keys': ['fake_private_key']}
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
        assert(game.tags[0].private_id == 'fake_private_key')

        player = fake_session.query(Player.platformid == '76561198018756583').first()
        assert(player is not None)

    def test_proto_upload_with_tags(self, test_client):

        proto, pandas, proto_game = write_proto_pandas_to_file(get_test_file(get_complex_replay_list()[0],
                                                                             is_replay=True))

        with open(proto, 'rb') as f:
            encoded_proto = base64.b64encode(zlib.compress(f.read())).decode()
        with open(pandas, 'rb') as f:
            encoded_pandas = base64.b64encode(zlib.compress(f.read())).decode()
        obj = {
            'status': '200',
            'proto': encoded_proto,
            'pandas': encoded_pandas
        }
        r = Request('POST', LOCAL_URL + '/api/upload/proto', json=obj, params={'tags': [TAG_NAME, TAG_NAME + "hello"],
                                                                               'player_id': proto_game.players[0].id.id})
        response = test_client.send(r)
        assert(response.status_code == 200)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')

        assert(game.name == '3 kickoffs 4 shots')
        assert(len(game.tags) == 2)
        assert(game.tags[0].name == TAG_NAME)
        assert(game.tags[0].owner == proto_game.players[0].id.id)
        assert(game.tags[0].games[0] == game)

        assert(game.tags[1].name == (TAG_NAME + "hello"))

        player = fake_session.query(Player.platformid == proto_game.players[0].id.id).first()
        assert(player is not None)

import base64
import io
import urllib
import zlib

import pytest
import responses
from requests import Request
from backend.blueprints.spa_api.service_layers.replay.tag import Tag as ServiceTag
from backend.database.objects import Game, Player, Tag
from backend.database.startup import get_current_session
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

    @pytest.mark.skip(reason="tag names are disabled")
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

    @pytest.mark.skip(reason="tag names are disabled")
    @responses.activate
    def test_replay_basic_server_upload_with_tags_gcp(self, test_client, gcp):
        responses.add(responses.POST, gcp.get_url())
        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert game is None
        params = {'player_id': default_player_id(), 'tags': [TAG_NAME, TAG_NAME + "hello"]}
        r = Request('POST', LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', self.stream)},
                    params=params)

        response = test_client.send(r)

        assert(response.status_code == 202)

        assert len(responses.calls) == 1

        request_url = responses.calls[0].request.url
        parse_result = urllib.parse.urlparse(request_url)
        query_result = urllib.parse.parse_qs(parse_result.query)
        assert query_result['player_id'] == [str(default_player_id())]
        assert query_result['tags'] == [TAG_NAME, TAG_NAME + "hello"]
        assert query_result['uuid'] is not None

    @pytest.mark.skip(reason="tag names are disabled")
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

        r = Request('GET', LOCAL_URL + '/api/player/76561198018756583/match_history?page=0&limit=10')
        response = test_client.send(r)
        assert response.status_code == 200
        assert len(response.json['replays']) == 1

    @pytest.mark.skip(reason="tag names are disabled")
    def test_replay_basic_server_upload_with_duplicate_tags(self, test_client):
        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert game is None
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

    @pytest.mark.skip(reason="tag names are disabled")
    def test_replay_basic_server_upload_tag_replay_no_player(self, test_client):
        params = {'tags': TAG_NAME}
        r = Request('POST', LOCAL_URL + '/api/upload',
                    files={'replays': ('fake_file.replay', self.stream)}, params=params)

        response = test_client.send(r)

        assert(response.status_code == 400)

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
        assert response.json == ServiceTag.encode_tag(tag.id, 'fake_private_key')

    def test_tag_modification_with_private_key(self, test_client, mock_user):
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

        r = Request('PUT', LOCAL_URL + '/api/tag/TAG/private_key/fake_private_key')
        response = test_client.send(r)
        assert(response.status_code == 204)

        fake_session.close()
        fake_session = get_current_session()

        tag = fake_session.query(Tag).first()
        assert tag.name == 'TAG'
        assert tag.owner == default_player_id()
        assert tag.private_id == 'fake_private_key'

        r = Request('GET', LOCAL_URL + '/api/tag/TAG/private_key')
        response = test_client.send(r)

        assert(response.status_code == 200)
        assert response.json == ServiceTag.encode_tag(tag.id, 'fake_private_key')

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
        assert game is None

        params = {'private_key': 'fake_private_key'}
        r = Request('PUT', LOCAL_URL + '/api/tag/' + TAG_NAME,
                    params=params)
        response = test_client.send(r)

        assert(response.status_code == 201)

        tag = fake_session.query(Tag).first()

        r = Request('GET', LOCAL_URL + '/api/tag/' + TAG_NAME + '/private_key')
        response = test_client.send(r)

        encoded_key = ServiceTag.encode_tag(tag.id, tag.private_id)
        assert response.json == encoded_key

        params = {'private_tag_keys': [encoded_key]}
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

    def test_key_encode_decode(self):
        ids = [10, 20000, 5, 12345678, 5, 20, 5]
        keys = ['10', '::::', 'banana', 'abcdefghijklmnopqrstuvwxyz', '', 'test', '!@#$%^&*()+']
        for index, id in enumerate(ids):
            encoded = ServiceTag.encode_tag(id, keys[index])
            test_id, test_key = ServiceTag.decode_tag(encoded)
            assert test_id == id
            assert test_key == keys[index]

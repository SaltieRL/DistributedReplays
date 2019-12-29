from requests import Request

from backend.database.objects import Game
from backend.blueprints.spa_api.service_layers.replay.json_tag import JsonTag
from backend.database.wrapper.tag_wrapper import TagWrapper
from tests.utils.location_utils import LOCAL_URL
from tests.utils.test_utils import check_array_equal


class TestReplayHistory:

    def test_get_replays_no_params_fails(self, test_client):
        r = Request('GET', LOCAL_URL + '/api/replay', params={})

        response = test_client.send(r)
        assert(response.status_code == 400)

    def test_get_replays_not_logged_in_fails(self, test_client, mock_user):
        mock_user.logout()
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0,
                                                              'tag_names': ['one']})

        response = test_client.send(r)
        assert(response.status_code == 401)

    def test_get_replays_none_in_server(self, test_client):
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0})

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json
        assert data['totalCount'] == len(data['replays']) == 0

    def test_get_all_replays(self, initialize_database_tags, test_client):
        session = initialize_database_tags.get_session()

        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0})


        games = session.query(Game).all()

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json
        assert data['totalCount'] == len(data['replays']) == len(games)

    def test_get_all_replays_with_player(self, initialize_database_tags, test_client):
        query_player = ['76561197998150808']

        session = initialize_database_tags.get_session()
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0,
                                                              'player_ids': query_player})

        games = session.query(Game).all()

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json

        # Check that every player we are querying exists in the replay, and no extras.
        for replay in data['replays']:
            player_count = []
            for players in replay['players']:
                if players['id'] in query_player:
                    player_count.append(players['id'])
            check_array_equal(player_count, query_player)

        assert data['totalCount'] == len(data['replays']) == 22

    def test_get_all_replays_with_players(self, initialize_database_tags, test_client):
        query_player = ['76561197998150808', '76561198041178440']
        session = initialize_database_tags.get_session()
        tags = initialize_database_tags.get_tags()
        tagged_games = initialize_database_tags.get_tagged_games()
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0,
                                                              'player_ids': query_player})

        games = session.query(Game).all()

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json

        # Check that every player we are querying exists in the replay, and no extras.
        for replay in data['replays']:
            player_count = []
            for players in replay['players']:
                if players['id'] in query_player:
                    player_count.append(players['id'])
            check_array_equal(player_count, query_player)

        assert data['totalCount'] == len(data['replays']) == 5

    def test_get_all_replays_with_date_before(self, initialize_database_tags, test_client):
        # before '2018-09-30T00:25:29'
        # '2018-09-30T23:28:39'

        timestamp = 1538303129

        session = initialize_database_tags.get_session()
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0,
                                                              'date_before': timestamp})

        games = session.query(Game).all()

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json

        # Check that every player we are querying exists in the replay, and no extras.
        for replay in data['replays']:
            player_count = []

        assert data['totalCount'] == len(data['replays']) == 13

    def test_get_all_replays_with_date_after(self, initialize_database_tags, test_client):
        timestamp = 1538303129

        session = initialize_database_tags.get_session()
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0,
                                                              'date_after': timestamp})

        games = session.query(Game).all()

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json

        # Check that every player we are querying exists in the replay, and no extras.
        for replay in data['replays']:
            player_count = []

        assert data['totalCount'] == len(data['replays']) == 13

    def test_get_all_replays_with_date_range(self, initialize_database_tags, test_client):
        # before '2018-09-30T00:25:29'
        # '2018-09-30T23:28:39'

        timestamp_before = 1538784000
        timestamp_after = 1538303129

        session = initialize_database_tags.get_session()
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0,
                                                              'date_before': timestamp_before,
                                                               'date_after': timestamp_after})

        games = session.query(Game).all()

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json

        # Check that every player we are querying exists in the replay, and no extras.
        for replay in data['replays']:
            player_count = []

        assert data['totalCount'] == len(data['replays']) == 11

    def test_get_all_replays_with_team_size(self, initialize_database_tags, test_client):
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0,
                                                              'team_size': 2})

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json

        assert data['totalCount'] == len(data['replays']) == 3

    def test_get_all_replays_with_tags(self, initialize_database_tags, test_client, mock_user):

        tags = initialize_database_tags.get_tags()
        tagged_games = initialize_database_tags.get_tagged_games()
        tag_name = tags[0][0]
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0,
                                                              'tag_names': tag_name})

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json

        # Check that every player we are querying exists in the replay, and no extras.
        for replay in data['replays']:
            assert replay['id'] in tagged_games[tag_name]

        assert data['totalCount'] == len(data['replays']) == 5

    def test_get_all_replays_with_tags_do_union(self, initialize_database_tags, test_client, mock_user):
        tags = initialize_database_tags.get_tags()
        tagged_games = initialize_database_tags.get_tagged_games()
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0,
                                                              'tag_names': [tags[-1][0], tags[-2][0]]})

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json

        assert data['totalCount'] != len(data['replays']) == 5

    def test_get_all_replays_with_tags_inside(self, initialize_database_tags, test_client, mock_user):
        tags = initialize_database_tags.get_tags()
        tagged_games = initialize_database_tags.get_tagged_games()
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0,
                                                              'tag_names': [tags[0][0], tags[1][0]]})

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json

        assert data['totalCount'] != len(data['replays']) == 5

    def test_get_all_replays_with_tags_no_overlap(self, initialize_database_tags, test_client, mock_user):
        tags = initialize_database_tags.get_tags()
        tagged_games = initialize_database_tags.get_tagged_games()
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0,
                                                              'tag_names': [tags[0][0], tags[3][0]]})

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json

        assert data['totalCount'] == len(data['replays']) == 9

    def test_get_all_replays_with_tags_private_id(self, initialize_database_tags, test_client, mock_user):
        session = initialize_database_tags.get_session()
        tags = initialize_database_tags.get_tags()
        tagged_games = initialize_database_tags.get_tagged_games()
        encoded_key_0 = JsonTag.get_encoded_private_key(tags[0][0], session=session)
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0,
                                                              'private_tag_keys': [encoded_key_0]})

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json

        assert data['totalCount'] == len(data['replays']) == 5

    def test_get_all_replays_with_tags_private_id_and_name(self, initialize_database_tags, test_client, mock_user):
        session = initialize_database_tags.get_session()
        tags = initialize_database_tags.get_tags()
        tagged_games = initialize_database_tags.get_tagged_games()
        encoded_key_0 = JsonTag.get_encoded_private_key(tags[0][0], session=session)
        encoded_key_2 = JsonTag.get_encoded_private_key(tags[2][0], session=session)
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0,
                                                              'tag_names': [tags[3][0]],
                                                              'private_tag_keys': [encoded_key_0, encoded_key_2]})

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json

        assert data['totalCount'] != len(data['replays']) == 10

    def test_get_all_replays_with_tags_invalid_private_id(self, initialize_database_tags, test_client, mock_user):
        session = initialize_database_tags.get_session()
        tags = initialize_database_tags.get_tags()

        tag_id = TagWrapper.get_tag_by_name(session, mock_user.get_user().platformid, tags[0][0]).id
        invalid_private_id = JsonTag.encode_tag(tag_id, 'invalid_key')
        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0,
                                                              'private_tag_keys': [invalid_private_id]})

        response = test_client.send(r)
        assert(response.status_code == 400)

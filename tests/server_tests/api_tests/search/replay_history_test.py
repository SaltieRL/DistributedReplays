from requests import Request

from database.objects import Game
from tests.utils.location_utils import LOCAL_URL
from tests.utils.test_utils import check_array_equal


class TestReplayHistory:

    def test_get_replays_no_params_fails(self, test_client):
        r = Request('GET', LOCAL_URL + '/api/replay', params={})

        response = test_client.send(r)
        assert(response.status_code == 400)

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

    def test_get_all_replays_with_tags(self, initialize_database_tags, test_client):
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
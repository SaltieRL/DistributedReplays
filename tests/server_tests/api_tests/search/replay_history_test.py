from requests import Request

from database.objects import Game
from tests.utils.location_utils import LOCAL_URL


class TestReplayHistory:

    def test_get_replays_no_params_fails(self, test_client):
        r = Request('GET', LOCAL_URL + '/api/replay', params={})

        response = test_client.send(r)
        assert(response.status_code == 400)

    def test_get_all_replays(self, initialize_database_tags, test_client):
        session = initialize_database_tags.get_session()
        tags = initialize_database_tags.get_tags()
        tagged_games = initialize_database_tags.get_tagged_games()

        r = Request('GET', LOCAL_URL + '/api/replay', params={'limit': 200, 'page': 0})


        games = session.query(Game).all()

        response = test_client.send(r)
        assert(response.status_code == 200)
        data = response.json
        print(data)
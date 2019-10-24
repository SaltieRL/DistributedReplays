from requests import Request

from backend.database.objects import Game
from backend.database.startup import get_current_session
from tests.utils.location_utils import LOCAL_URL


class Test_download_positions:

    def test_replay_get_all_positions(self, test_client, fake_file_locations, fake_write_location,
                                      use_test_paths, initialize_database):
        use_test_paths.patch()
        protos = initialize_database.get_protos()
        ids = initialize_database.get_ids()
        self.replay_proto = protos[0]
        self.replay_id = ids[0]

        game = get_current_session().query(Game).first()
        assert game is not None

        r = Request('GET', LOCAL_URL + '/api/replay/'+str(self.replay_id)+'/positions')

        response = test_client.send(r)

        assert(response.status_code == 200)
        data = response.json
        names = data['names']
        assert names[0] == 'dtracers'
        assert data['id'] == '70DDECEA4653AC55EA77DBA0DB497995'
        assert len(data['ball']) == 1012
        print(data)

    def test_replay_get_some_positions(self, test_client, fake_file_locations, fake_write_location,
                                      use_test_paths, initialize_database):
        use_test_paths.patch()
        protos = initialize_database.get_protos()
        ids = initialize_database.get_ids()
        self.replay_proto = protos[0]
        self.replay_id = ids[0]

        game = get_current_session().query(Game).first()
        assert game is not None

        r = Request('GET', LOCAL_URL + '/api/replay/'+str(self.replay_id)+'/positions', params={
            'frame': [1, 6, 301]
        })

        response = test_client.send(r)

        assert(response.status_code == 200)
        data = response.json
        names = data['names']
        assert names[0] == 'dtracers'
        assert data['id'] == '70DDECEA4653AC55EA77DBA0DB497995'
        assert len(data['ball']) == 3
        assert data['ball'][0] == [0.0, 0.0, 92.74]
        assert data['ball'][1] == [0.0, 0.0, 92.74]
        print(data)

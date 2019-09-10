from requests import Request

from backend.database.objects import Game
from backend.database.startup import get_current_session
from tests.utils.database_utils import initialize_db_with_replays

LOCAL_URL = 'http://localhost:8000'


class Test_download_positions:

    def test_replay_get_all_positions(self, test_client, fake_file_locations, fake_write_location):
        session, protos, ids = initialize_db_with_replays(['3_KICKOFFS_4_SHOTS.replay'])
        self.replay_proto = protos[0]
        self.replay_id = ids[0]

        game = get_current_session().query(Game).first()
        assert game is not None

        r = Request('GET', LOCAL_URL + '/api/replay/'+str(self.replay_id)+'/positions')

        response = test_client.send(r)

        assert(response.status_code == 200)
        data = response.json
        print(data)

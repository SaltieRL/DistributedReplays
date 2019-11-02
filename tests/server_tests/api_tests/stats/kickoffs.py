from requests import Request

from backend.database.objects import Game
from backend.database.startup import get_current_session
from tests.utils.location_utils import LOCAL_URL


class TestGetKickoffs:

    def test_replay_get_3_kickoffs(self, test_client, mock_user, mock_get_proto, initialize_database_small_replays):
        mock_user.logout()
        game = get_current_session().query(Game).first()
        assert game is not None

        replay_index = initialize_database_small_replays.get_index_from_name('3_KICKOFFS_4_SHOTS')
        mock_get_proto(initialize_database_small_replays.get_protos()[replay_index])

        r = Request('GET', LOCAL_URL + '/api/replay/' +
                    str(initialize_database_small_replays.get_ids()[replay_index]) + '/kickoffs')

        response = test_client.send(r)

        assert(response.status_code == 200)
        data = response.json

        # in the future assert each new stat that is being added.
        assert len(data['kickoffs']) == 3
        assert len(data['players']) == 1

    def test_replay_get_no_kickoffs(self, test_client, mock_user, mock_get_proto, initialize_database_small_replays):
        mock_user.logout()
        game = get_current_session().query(Game).first()
        assert game is not None

        replay_index = initialize_database_small_replays.get_index_from_name('NO_KICKOFF')
        mock_get_proto(initialize_database_small_replays.get_protos()[replay_index])

        r = Request('GET', LOCAL_URL + '/api/replay/' +
                    str(initialize_database_small_replays.get_ids()[replay_index]) + '/kickoffs')

        response = test_client.send(r)

        assert(response.status_code == 200)
        data = response.json

        # in the future assert each new stat that is being added.
        assert len(data['kickoffs']) == 0
        assert len(data['players']) == 1

    def test_replay_get_invalid_replay(self, test_client):

        r = Request('GET', LOCAL_URL + '/api/replay/INVALID_REPLAY/kickoffs')

        response = test_client.send(r)

        assert(response.status_code == 404)

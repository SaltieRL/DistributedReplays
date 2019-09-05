from requests import Request

from backend.database.objects import Game
from backend.database.startup import get_current_session
from tests.utils.database_utils import initialize_db_with_replays

LOCAL_URL = 'http://localhost:8000'


class Test_edit_private_replay:
    replay_status = []

    def setup_method(self):
        initialize_db_with_replays(['crossplatform_party.replay'])
        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        self.replay_id = game.hash

    def test_replay_get_basic_stats(self, test_client, fake_user):
        game = get_current_session().query(Game).first()
        assert game is not None

        r = Request('GET', LOCAL_URL + '/api/replay/'+str(self.replay_id)+'/basic_player_stats')

        response = test_client.send(r)

        assert(response.status_code == 200)
        data = response.json

        # in the future assert each new stat that is being added.
        assert len(data) == 61

    def test_replay_get_team_stats(self, test_client, fake_user):
        game = get_current_session().query(Game).first()
        assert game is not None

        r = Request('GET', LOCAL_URL + '/api/replay/'+str(self.replay_id)+'/basic_team_stats')

        response = test_client.send(r)

        assert(response.status_code == 200)
        data = response.json

        # in the future assert each new stat that is being added.
        assert len(data) == 12

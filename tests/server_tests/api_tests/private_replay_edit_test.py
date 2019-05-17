from datetime import datetime
import io
from unittest import mock

from requests import Request
from sqlalchemy import or_

from backend.database.objects import Game, GameVisibilitySetting, GameVisibility, PlayerGame, Player
from backend.database.startup import get_current_session, EngineStartup
from backend.utils.time_related import hour_rounder
from tests.utils.database_utils import default_player_id
from tests.utils.replay_utils import get_complex_replay_list, download_replay_discord

LOCAL_URL = 'http://localhost:8000'


class Test_edit_private_replay:
    replay_status = []

    def setup_method(self):
        replay_url = get_complex_replay_list()[0]
        f = download_replay_discord(replay_url)
        self.file = f
        self.stream = io.BytesIO(self.file)

    def test_replay_edit_private_replay(self, test_client, mock_db):
        mock_db.create_mock_db_instance(existing_data=[
            (
                [mock.call.query(GameVisibility),
                 mock.call.filter(GameVisibility.player == '10',
                                  GameVisibility.game == '70DDECEA4653AC55EA77DBA0DB497995')],
                [None]
            ),
            (
                [mock.call.query(Game),
                 mock.call.filter(or_(Game.visibility != GameVisibilitySetting.PRIVATE,
                            Game.players.any('10'))),
                 mock.call.filter(Player.platformid == '10')],
                [Game()]
            )
        ])
        mock_db.apply_mock()

        api_url = '/api/70DDECEA4653AC55EA77DBA0DB497995/visibility/' + GameVisibilitySetting.PRIVATE.name
        r = Request('PUT', LOCAL_URL + api_url)

        response = test_client.send(r)

        assert(response.status_code == 202)

        fake_session = get_current_session()
        game = fake_session.query(Game).first()
        assert(game.hash == '70DDECEA4653AC55EA77DBA0DB497995')
        assert(game.visibility == GameVisibilitySetting.PRIVATE)

        game_visiblity = fake_session.query(GameVisibility).first()
        assert(game_visiblity.game == game.hash)
        assert(game_visiblity.player == default_player_id())
        assert(game_visiblity.visibility == GameVisibilitySetting.PRIVATE)
        assert(game_visiblity.release_date == hour_rounder(date))

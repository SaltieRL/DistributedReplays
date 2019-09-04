import json
import time

import requests

from RLBotServer import start_server
from tests.utils.killable_thread import KillableThread
from tests.utils.replay_utils import write_proto_pandas_to_file, get_test_file, download_replay_discord

LOCAL_URL = 'http://localhost:8000'


class Test_Heatmaps:

    @classmethod
    def setup_class(cls):
        cls.thread = KillableThread(target=start_server)
        cls.thread.daemon = True
        cls.thread.start()
        print('waiting for a bit')
        time.sleep(5)
        print('done waiting')

    def test_heatmaps(self):
        proto, pandas, proto_game = write_proto_pandas_to_file(get_test_file("3_DRIBBLES_2_FLICKS.replay",
                                                                             is_replay=True))

        f = download_replay_discord("3_DRIBBLES_2_FLICKS.replay")
        r = requests.post(LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', f)})
        r.raise_for_status()
        assert(r.status_code == 202)

        time.sleep(30)

        r = requests.get(LOCAL_URL + '/api/global/replay_count')
        result = json.loads(r.content)
        assert int(result) > 0

        # actual test

        id = proto_game.game_metadata.match_guid

        r = requests.get(LOCAL_URL + '/api/replay/' + id + '/heatmaps')
        r.raise_for_status()
        assert r.status_code == 200
        result = json.loads(r.content)
        assert 'data' in result
        assert 'maxs' in result
        def assert_keys(value):
            assert 'ball' in value
            assert proto_game.players[0].name in value
        assert_keys(result['data'])
        assert_keys(result['maxs'])

    @classmethod
    def teardown_class(cls):
        try:
            cls.thread.terminate()
        except:
            pass
        cls.thread.join()
        time.sleep(2)

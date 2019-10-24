import base64
import json
import logging
import time
import zlib

import requests

from RLBotServer import start_server
from backend.blueprints.spa_api.service_layers.replay.enums import HeatMapType
from backend.tasks.add_replay import save_replay
from tests.utils.killable_thread import KillableThread
from tests.utils.replay_utils import write_proto_pandas_to_file, get_test_file, download_replay_discord
from backend.utils.file_manager import PANDAS_EXTENSION, PROTO_EXTENSION

LOCAL_URL = 'http://localhost:8000'


class Test_Heatmaps:

    @classmethod
    def setup_class(cls):
        logging.basicConfig(level=logging.ERROR)
        cls.thread = KillableThread(target=start_server)
        cls.thread.daemon = True
        cls.thread.start()
        print('waiting for a bit')
        time.sleep(5)
        print('done waiting')

    def test_heatmaps(self, use_test_paths, temp_file):
        use_test_paths.patch()

        test_path = use_test_paths.get_temp_path()

        proto, pandas, proto_game = write_proto_pandas_to_file(get_test_file("ALL_STAR.replay",
                                                                             is_replay=True))

        with open(proto, 'rb') as f:
            encoded_proto = base64.b64encode(zlib.compress(f.read())).decode()
        obj = {
            'status': '200',
            'proto': encoded_proto
        }
        r = requests.post(LOCAL_URL + '/api/upload/proto', json=obj)
        r.raise_for_status()
        assert(r.status_code == 200)

        save_replay(proto_game, temp_file, pandas[:-len(PANDAS_EXTENSION)], proto[:-len(PROTO_EXTENSION)])

        r = requests.get(LOCAL_URL + '/api/global/replay_count')
        result = json.loads(r.content)
        assert int(result) > 0, 'This test can not run without a replay in the database'

        # test default
        self.assert_heatmap(proto_game, has_ball=True)

        # test query params
        self.assert_heatmap(proto_game, query_params={"type": HeatMapType.POSITIONING.value}, has_ball=True)
        self.assert_heatmap(proto_game, query_params={"type": HeatMapType.BOOST.value})
        self.assert_heatmap(proto_game, query_params={"type": HeatMapType.BOOST_COLLECT.value})
        self.assert_heatmap(proto_game, query_params={"type": HeatMapType.BOOST_SPEED.value})
        self.assert_heatmap(proto_game, query_params={"type": HeatMapType.SLOW_SPEED.value})

    def assert_heatmap(self, proto_game, query_params=None, has_ball=False):
        id = proto_game.game_metadata.match_guid
        r = requests.get(LOCAL_URL + '/api/replay/' + id + '/heatmaps',
                         params=query_params)
        r.raise_for_status()
        assert r.status_code == 200
        result = json.loads(r.content)
        assert 'data' in result
        assert 'maxs' in result

        def assert_keys(value):
            if has_ball:
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

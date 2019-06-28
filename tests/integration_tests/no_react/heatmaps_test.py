import base64
import json
import time
import zlib

import requests

from RLBotServer import start_server
from tests.utils.killable_thread import KillableThread
from tests.utils.replay_utils import write_proto_pandas_to_file, get_test_file

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
        proto, pandas, proto_game = write_proto_pandas_to_file(get_test_file("3_KICKOFFS_4_SHOTS.replay",
                                                                             is_replay=True))

        with open(proto, 'rb') as f:
            encoded_proto = base64.b64encode(zlib.compress(f.read())).decode()
        with open(pandas, 'rb') as f:
            encoded_pandas = base64.b64encode(zlib.compress(f.read())).decode()
        obj = {
            'status': '200',
            'proto': encoded_proto,
            'pandas': encoded_pandas
        }
        r = requests.post(LOCAL_URL + '/api/upload/proto', json=obj)

        r.raise_for_status()
        assert r.status_code == 200

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

import base64
import json
import tempfile
import time
import unittest
import zlib

import requests
from carball.decompile_replays import analyze_replay_file

from RLBotServer import start_server
from backend.database.objects import GameVisibilitySetting
from tests.utils.killable_thread import KillableThread
from tests.utils.replay_utils import get_test_file, clear_dir, write_proto_pandas_to_file

LOCAL_URL = 'http://localhost:8000'


class Test_UploadingProtos():

    @classmethod
    def setUpClass(cls):
        cls.thread = KillableThread(target=start_server)
        cls.thread.daemon = True
        cls.thread.start()
        print('waiting for a bit')
        time.sleep(2)
        print('done waiting')

    def test_upload_proto(self):
        tags = [['TAG4', 'TAG2']]
        privacy = [GameVisibilitySetting.PRIVATE.name,
                   GameVisibilitySetting.PUBLIC.name,
                   GameVisibilitySetting.PRIVATE.name,
                   GameVisibilitySetting.PRIVATE.name]

        proto, pandas, proto_game = write_proto_pandas_to_file(get_test_file("3_KICKOFFS_4_SHOTS.replay",
                                                                             is_replay=True))

        users = [
            proto_game.players[0].id.id
        ]

        with open(proto, 'rb') as f:
            encoded_proto = base64.b64encode(zlib.compress(f.read())).decode()
        with open(pandas, 'rb') as f:
            encoded_pandas = base64.b64encode(zlib.compress(f.read())).decode()
        obj = {
            'status': '200',
            'proto': encoded_proto,
            'pandas': encoded_pandas
        }
        r = requests.post(LOCAL_URL + '/api/upload/proto', json=obj, params={'tags': tags[0],
                                                                             'visibility': privacy[0],
                                                                             'player_id': users[0]})

        r.raise_for_status()
        self.assertEqual(r.status_code, 200)

        r = requests.get(LOCAL_URL + '/api/global/replay_count')
        result = json.loads(r.content)
        self.assertEqual(int(result), 1)

    @classmethod
    def tearDownClass(cls) -> None:
        clear_dir()
        try:
            cls.thread.terminate()
        except:
            pass
        cls.thread.join()

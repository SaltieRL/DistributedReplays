import base64
import json
import tempfile
import time
import unittest
import zlib

import requests
from carball.decompile_replays import analyze_replay_file

from RLBotServer import start_server
from tests.utils.killable_thread import KillableThread
from tests.utils.replay_utils import write_files_to_disk, get_test_file, clear_dir

LOCAL_URL = 'http://localhost:8000'


class Test_UploadingProtos(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.thread = KillableThread(target=start_server)
        cls.thread.daemon = True
        cls.thread.start()
        print('waiting for a bit')
        time.sleep(2)
        print('done waiting')
        write_files_to_disk(
            ['https://cdn.discordapp.com/attachments/493849514680254468/501630263881760798/OCE_RLCS_7_CARS.replay'])

    def test_upload_proto(self):
        proto, pandas = self.__decompile_replay(get_test_file("OCE_RLCS_7_CARS.replay"))
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

    def __decompile_replay(self, filename):
        proto_manager = analyze_replay_file(filename)
        _, proto_name = tempfile.mkstemp()
        with open(proto_name, 'wb') as f:
            proto_manager.write_proto_out_to_file(f)
        _, pandas_name = tempfile.mkstemp()
        with open(pandas_name, 'wb') as f:
            proto_manager.write_pandas_out_to_file(f)
        return proto_name, pandas_name
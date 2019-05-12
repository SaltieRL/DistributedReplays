import time
import unittest

import requests

from RLBotServer import start_server
from tests.server_tests.utils import get_complex_replay_list, download_replay_discord, KillableThread

LOCAL_URL = 'http://localhost:8000'


class RunningServerTest(unittest.TestCase):
    replay_status = []

    @classmethod
    def setUpClass(cls):
        cls.thread = KillableThread(target=start_server)
        cls.thread.daemon = True
        cls.thread.start()
        print('waiting for a bit')
        time.sleep(2)
        print('done waiting')

    def test_upload_files(self):
        for replay_url in get_complex_replay_list():
            print('Testing:', replay_url)
            f = download_replay_discord(replay_url)
            r = requests.post(LOCAL_URL + '/api/upload', files={'replays': f})
            r.raise_for_status()
            self.assertEqual(r.status_code, 202)

        print(self.replay_status)

    def test_upload_file_bad_request(self):
        for replay_url in get_complex_replay_list():
            print('Testing:', replay_url)
            f = download_replay_discord(replay_url)
            r = requests.post(LOCAL_URL + '/api/upload', files={'replayst': f})
            r.raise_for_status()
            self.assertEqual(r.status_code, 400)

        print(self.replay_status)

    @classmethod
    def tearDownClass(cls):
        try:
            cls.thread.terminate()
        except:
            pass
        cls.thread.join()

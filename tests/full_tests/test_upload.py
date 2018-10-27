import unittest
from threading import Thread

import requests

from RLBotServer import start_server
from tests.utils import get_complex_replay_list, download_replay_discord


class RunningServerTest(unittest.TestCase):

    replay_status = []
    @classmethod
    def setUpClass(cls):
        start_server()
        cls.thread = Thread(target=start_server)
        cls.thread.start()
        for replay_url in get_complex_replay_list():
            cls.replay_status.append(requests.post('http://localhost:8000/api/upload', files={'file': download_replay_discord(replay_url)}))

    def tearDownClass(cls):
        cls.thread.

    def test_replays_status(self):
        print(self.replay_status)

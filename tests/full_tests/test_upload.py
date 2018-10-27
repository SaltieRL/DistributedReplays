import unittest

import requests

from tests.utils import get_complex_replay_list, download_replay_discord


class RunningServerTest(unittest.TestCase):

    replay_status = []
    @classmethod
    def setUpClass(cls):
        for replay_url in get_complex_replay_list():
            cls.replay_status.append(requests.post('http://localhost:3000/api/upload', files={'file': download_replay_discord(replay_url)}))


    def test_replays_status(self):
        print(self.replay_status)

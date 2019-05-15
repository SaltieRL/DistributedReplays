import time
import unittest

import requests

from RLBotServer import start_server
from backend.tasks.celery_tasks import parse_replay_task
from tests.utils import write_files_to_disk, clear_dir, get_test_file, get_test_folder, KillableThread

LOCAL_URL = 'http://localhost:8000'


class HeatmapTest(unittest.TestCase):

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
        result = parse_replay_task.apply(args=(get_test_file('OCE_RLCS_7_CARS.replay'), False, get_test_folder(), True),
                                         throw=True).get()
    #
    # def test_heatmaps(self):
    #     r = requests.get(LOCAL_URL + '/api/replay/5699EF4011E8B3E248B0878371BE58A5/heatmaps', timeout=30)
    #     r.raise_for_status()
    #     self.assertEqual(r.status_code, 200)

    @classmethod
    def tearDownClass(cls) -> None:
        clear_dir()
        try:
            cls.thread.terminate()
        except:
            pass
        cls.thread.join()

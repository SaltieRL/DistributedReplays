import unittest

from backend.tasks.celery_tasks import parse_replay_task
from tests.utils import get_complex_replay_list, download_replay_discord, write_files_to_disk, clear_dir, \
    get_test_folder, get_test_file


class RunningServerTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        write_files_to_disk(['https://cdn.discordapp.com/attachments/493849514680254468/501630263881760798/OCE_RLCS_7_CARS.replay'])

    def test_parse_replay(self):
        result = parse_replay_task.apply(args=(get_test_file('OCE_RLCS_7_CARS.replay'), False, get_test_folder(), True), throw=True).get()
        self.assertEqual(result, '5699EF4011E8B3E248B0878371BE58A5')

    @classmethod
    def tearDownClass(cls) -> None:
        clear_dir()
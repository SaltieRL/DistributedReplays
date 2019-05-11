import unittest

from backend.tasks.celery_tasks import parse_replay_task, calc_global_stats
from tests.utils import get_complex_replay_list, download_replay_discord, write_files_to_disk, clear_dir, \
    get_test_folder, get_test_file


class RunningServerTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        write_files_to_disk(['https://cdn.discordapp.com/attachments/493849514680254468/501630263881760798/OCE_RLCS_7_CARS.replay'])

    def test_parse_replay(self):
        result = parse_replay_task.apply(throw=True,
                                         kwargs={'filename':get_test_file('OCE_RLCS_7_CARS.replay'),
                                                 'custom_file_location': get_test_folder(),
                                                 'force_reparse': True}).get()
        self.assertEqual(result, '5699EF4011E8B3E248B0878371BE58A5')

    def test_global_stats_dont_crash_null_data(self):
        calc_global_stats.apply(throw=True).get()

    @classmethod
    def tearDownClass(cls) -> None:
        clear_dir()

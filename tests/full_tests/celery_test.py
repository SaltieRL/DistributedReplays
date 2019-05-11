import os
import unittest

from backend.tasks.celery_tasks import parse_replay_task
from tests.utils import get_complex_replay_list, download_replay_discord, write_files_to_disk, clear_dir


class RunningServerTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        write_files_to_disk(get_complex_replay_list())

    def test_parse_replay(self):
        result = parse_replay_task

    @classmethod
    def tearDownClass(cls) -> None:
        clear_dir()
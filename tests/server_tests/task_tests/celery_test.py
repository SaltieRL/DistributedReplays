from backend.tasks.celery_tasks import parse_replay_task, calc_global_stats
from tests.utils.replay_utils import write_files_to_disk, get_test_file, clear_dir, get_complex_replay_list
from tests.utils.location_utils import get_test_folder


class TestCelerytasks():

    def test_parse_replay(self, temp_folder):
        write_files_to_disk([get_complex_replay_list()[0]], temp_folder=temp_folder)
        result = parse_replay_task.apply(throw=True,
                                         kwargs={'filename': get_test_file('3_KICKOFFS_4_SHOTS.replay',
                                                                           temp_folder=temp_folder),
                                                 'custom_file_location': get_test_folder(temp_folder),
                                                 'force_reparse': True}).get()
        assert(result == '70DDECEA4653AC55EA77DBA0DB497995')

    def test_global_stats_dont_crash_null_data(self):
        calc_global_stats.apply(throw=True).get()

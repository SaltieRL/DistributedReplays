import os

default_test_data_folder_location = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'test_data')


def get_test_folder(temp_folder=None):
    if temp_folder is not None:
        return temp_folder
    if not os.path.exists(default_test_data_folder_location):
        os.mkdir(default_test_data_folder_location)
    return default_test_data_folder_location

def get_test_replay_folder():
    return os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'test_replays')
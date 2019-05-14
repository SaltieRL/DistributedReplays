import os

default_test_data_folder_location = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'test_data')


def get_test_folder():
    if not os.path.exists(default_test_data_folder_location):
        os.mkdir(default_test_data_folder_location)
    return default_test_data_folder_location

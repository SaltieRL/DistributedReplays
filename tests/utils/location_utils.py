import os

folder_location = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'test_data')


def get_test_folder():
    if not os.path.exists(folder_location):
        os.mkdir(folder_location)
    return folder_location

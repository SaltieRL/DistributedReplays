import os

default_test_data_folder_location = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'test_data')


def get_test_folder(temp_folder=None):
    return TestFolderManager.get_test_folder(temp_folder=temp_folder)


def get_test_replay_folder():
    """
    :return: The folder where downloaded replays are stored for testing.
    """
    return os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'test_replays')


class TestFolderManager:
    @staticmethod
    def get_internal_default_test_folder_location():
        return default_test_data_folder_location

    @staticmethod
    def get_test_folder(temp_folder=None):
        if temp_folder is not None:
            return temp_folder
        if not os.path.exists(TestFolderManager.get_internal_default_test_folder_location()):
            os.mkdir(TestFolderManager.get_internal_default_test_folder_location())
        return TestFolderManager.get_internal_default_test_folder_location()

import os


import sys
# the mock-0.3.1 dir contains testcase.py, testutils.py & mock.py
saltie = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__)))) + '/Saltie/'

print('import path', saltie)
sys.path.append(saltie)

from conversions import server_converter
from conversions import input_formatter
from trainer import offline_trainer

server_ip = 'http://0.0.0.0:5000/'
num_features = input_formatter.get_state_dim_with_features()

print(num_features)


if __name__ == '__main__':
    test_server = server_converter.ServerConverter(server_ip, True, True, True, num_players=2, num_my_team=1,
                                       username='test3', model_hash='1234567')

    test_files = offline_trainer.get_all_files(1, False)
    print(test_files)
    data_directory = os.path.dirname(os.path.realpath(__file__)) + '/data'
    print(data_directory)

    counter = 0
    for file in test_files:
        print('uploading ', file)
        test_server.is_eval = counter % 2 == 0
        counter += 1
        test_server.maybe_upload_replay(file)
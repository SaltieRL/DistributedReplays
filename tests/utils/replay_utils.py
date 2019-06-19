import os
import tempfile

import requests
from carball import analyze_replay_file

from tests.utils.location_utils import get_test_folder, get_test_replay_folder


def get_test_file(file_name, temp_folder=None, is_replay=False):
    if is_replay:
        folder = get_test_replay_folder()
    else:
        folder = get_test_folder(temp_folder=temp_folder)
    return os.path.join(folder, file_name)


def download_replay_discord(url):
    if 'http' not in url:
        return open(os.path.join(get_test_replay_folder(), url),
                    mode='rb').read()
    file = requests.get(url, stream=True)
    replay = file.raw
    return replay.data


def parse_file(replay):
    replay_name = write_files_to_disk([replay])[0]
    replay = analyze_replay_file(os.path.join(get_test_folder(), replay_name),
                                 os.path.join(get_test_folder(), replay_name) + '.json')
    proto = replay.protobuf_game
    if proto.game_metadata.match_guid is not None and proto.game_metadata.match_guid != '':
        guid = proto.game_metadata.match_guid
    else:
        guid = proto.game_metadata.id
    return replay, proto, guid


def write_proto_pandas_to_file(filename):
    proto_manager = analyze_replay_file(filename)
    _, proto_name = tempfile.mkstemp(dir=get_test_folder())
    with open(proto_name, 'wb') as f:
        proto_manager.write_proto_out_to_file(f)
    _, pandas_name = tempfile.mkstemp(dir=get_test_folder())
    with open(pandas_name, 'wb') as f:
        proto_manager.write_pandas_out_to_file(f)
    return proto_name, pandas_name, proto_manager.protobuf_game


def get_complex_replay_list():
    """
    Replays for testing that are small.
    :return:
    """
    return [
        '3_KICKOFFS_4_SHOTS.replay',
        'NO_KICKOFF.replay',
        'ZEROED_STATS.replay',
        'RUMBLE_FULL.replay',
        'crossplatform_party.replay',
        'FAKE_BOTS_SkyBot.replay',
        'WASTED_BOOST_WHILE_SUPER_SONIC.replay',
    ]


def write_files_to_disk(replays, temp_folder=None):
    if not os.path.exists(get_test_folder(temp_folder=temp_folder)):
        os.mkdir(get_test_folder(temp_folder=temp_folder))
    file_names = []
    for replay_url in replays:
        if 'http' not in replay_url:
            f = open(os.path.join(get_test_replay_folder(), replay_url),
                     mode='rb').read()
            file_names.append(replay_url)
            file_name = replay_url
        else:
            print('Testing:', replay_url)
            file_name = replay_url[replay_url.rfind('/') + 1:]
            file_names.append(file_name)
            f = download_replay_discord(replay_url)
        with open(os.path.join(get_test_folder(temp_folder=temp_folder), file_name), 'wb') as real_file:
            real_file.write(f)
    return file_names


def clear_dir():
    try:
        os.remove(get_test_folder())
    except:
        pass
    for root, dirs, files in os.walk(get_test_folder()):
        for file in files:
            try:
                os.remove(file)
            except:
                pass
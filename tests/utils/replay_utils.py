import os

import requests
from carball import analyze_replay_file

from tests.utils.location_utils import get_test_folder


def get_test_file(file_name, temp_folder=None):
    return os.path.join(get_test_folder(temp_folder=temp_folder), file_name)


def download_replay_discord(url):
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


def get_complex_replay_list():
    """
    Replays for testing that are small.
    :return:
    """
    return [
        'https://cdn.discordapp.com/attachments/493849514680254468/496034443442782208/3_KICKOFFS_4_SHOTS.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/496034430943756289/NO_KICKOFF.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/568555561160015889/RUMBLE_FULL.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/561300088400379905/crossplatform_party.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/496153605074845734/ZEROED_STATS.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/496180938968137749/FAKE_BOTS_SkyBot.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/497191273619259393/WASTED_BOOST_WHILE_SUPER_SONIC.replay',
    ]


def write_files_to_disk(replays, temp_folder=None):
    if not os.path.exists(get_test_folder(temp_folder=temp_folder)):
        os.mkdir(get_test_folder(temp_folder=temp_folder))
    file_names = []
    for replay_url in replays:
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
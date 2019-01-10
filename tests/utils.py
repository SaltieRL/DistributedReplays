import requests


def download_replay_discord(url):
    file = requests.get(url, stream=True)
    replay = file.raw
    return replay.data


def get_complex_replay_list():
    """
    For full replays that have crashed or failed to be converted
    :return:
    """
    return [
        'https://cdn.discordapp.com/attachments/493849514680254468/501630263881760798/OCE_RLCS_7_CARS.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/497149910999891969/NEGATIVE_WASTED_COLLECTION.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/496153554977816576/BOTS_JOINING_AND_LEAVING.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/496153569981104129/BOTS_NO_POSITION.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/496153605074845734/ZEROED_STATS.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/496180938968137749/FAKE_BOTS_SkyBot.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/497191273619259393/WASTED_BOOST_WHILE_SUPER_SONIC.replay',
    ]

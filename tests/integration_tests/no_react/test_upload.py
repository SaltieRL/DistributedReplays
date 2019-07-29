import json
import logging
import time
from typing import List

import requests

from RLBotServer import start_server
from backend.database.objects import GameVisibilitySetting, User, Player
from backend.blueprints.spa_api.errors.errors import PlayerNotFound
from tests.utils.killable_thread import KillableThread
from tests.utils.replay_utils import get_complex_replay_list, download_replay_discord

LOCAL_URL = 'http://localhost:8000'

logger = logging.getLogger(__name__)

sleep_time = 30


class Test_BasicServerCommands():
    replay_status = []


    @classmethod
    def setup_class(cls):
        cls.thread = KillableThread(target=start_server)
        cls.thread.daemon = True
        cls.thread.start()
        print('waiting for a bit')
        time.sleep(5)
        print('done waiting')

    def test_upload_files(self, mock_user, no_errors_are_logged):
        no_errors_are_logged.cancel_check()

        mock_user.set_fake_user(Player(platformid='76561198018756583', platformname='fake'))

        replay_list = get_complex_replay_list()[0:4]

        tags = [['TAG1'], ['TAG2'], ['TAG3'], ['TAG4', 'TAG2']]
        privacy = [GameVisibilitySetting.DEFAULT.name,
                   GameVisibilitySetting.PUBLIC.name,
                   GameVisibilitySetting.PRIVATE.name,
                   GameVisibilitySetting.PRIVATE.name]
        users = [
            'invalid',
            '76561198018756583',
            '76561198018756583',
            '76561198018756583'
        ]

        tag_keys = ['invalid_key']

        def create_all_tags():
            created_tags = []
            for _tags in tags:
                keys = []
                for _tag in _tags:
                    if _tag not in created_tags:
                        r = requests.put(LOCAL_URL + f'/api/tag/{_tag}')
                        r.raise_for_status()
                        created_tags.append(_tag)

                        # create private id
                        r = requests.put(LOCAL_URL + f'/api/tag/{_tag}/private_key/{_tag}')
                        r.raise_for_status()
                    json = requests.get(LOCAL_URL + f'/api/tag/{_tag}/private_key').json()
                    keys.append(json)
                tag_keys.append(keys)


        for index, replay_url in enumerate(replay_list):
            if index == 1:
                create_all_tags()
                time.sleep(1)

            params = {'visibility': privacy[index], 'player_id': users[index], 'private_tag_keys': tag_keys[index]}
            logger.debug('Testing:', replay_url)
            f = download_replay_discord(replay_url)
            r = requests.post(LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', f)}, params=params)
            r.raise_for_status()
            assert(r.status_code == 202)

        for i in range(len(replay_list) + 1):
            logger.debug('waiting ', (len(replay_list) - i) * sleep_time, 'seconds')
            time.sleep(sleep_time)

        time.sleep(sleep_time)
        r = requests.get(LOCAL_URL + '/api/global/replay_count')

        result = json.loads(r.content)
        assert(int(result) == len(replay_list))

        response = requests.get(LOCAL_URL + '/api/tag')
        result = json.loads(response.content)
        assert result[0]['ownerId'] == "76561198018756583"
        assert result[0]['name'].startswith('TAG')
        assert len(result) == 4

        response = requests.get(LOCAL_URL + '/api/player/76561198018756583/match_history?page=0&limit=10')
        assert response.status_code == 200
        assert len(response.json()['replays']) >= 1

    @classmethod
    def teardown_class(cls):
        try:
            cls.thread.terminate()
        except:
            pass
        cls.thread.join()
        time.sleep(2)

import json
import logging
import time

import requests

from RLBotServer import start_server
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

    def test_upload_files(self):

        replay_list = get_complex_replay_list()[0:4]

        for replay_url in replay_list:
            logger.debug('Testing:', replay_url)
            f = download_replay_discord(replay_url)
            r = requests.post(LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', f)})
            r.raise_for_status()
            assert(r.status_code == 202)

        for i in range(len(replay_list) + 1):
            logger.debug('waiting ', (len(replay_list) - i) * sleep_time, 'seconds')
            time.sleep(sleep_time)

        time.sleep(sleep_time)
        r = requests.get(LOCAL_URL + '/api/global/replay_count')
        result = json.loads(r.content)
        assert(int(result) == len(replay_list))

    @classmethod
    def teardown_class(cls):
        try:
            cls.thread.terminate()
        except:
            pass
        cls.thread.join()

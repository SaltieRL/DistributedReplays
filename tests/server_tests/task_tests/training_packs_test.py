import json
import time

import requests

from RLBotServer import start_server
from backend.tasks.celery_tasks import create_training_pack
from tests.utils.killable_thread import KillableThread
from tests.utils.replay_utils import download_replay_discord

LOCAL_URL = 'http://localhost:8000'


class TestTrainingPacks:

    @classmethod
    def setup_class(cls):
        cls.thread = KillableThread(target=start_server)
        cls.thread.daemon = True
        cls.thread.start()
        print('waiting for a bit')
        time.sleep(5)
        print('done waiting')

    def test_training_packs(self):
        f = download_replay_discord("TRAINING_PACK.replay")
        r = requests.post(LOCAL_URL + '/api/upload', files={'replays': ('fake_file.replay', f)})
        r.raise_for_status()
        assert (r.status_code == 202)

        time.sleep(35)

        r = requests.get(LOCAL_URL + '/api/global/replay_count')
        result = json.loads(r.content)
        assert int(result) > 0, 'This test can not run without a replay in the database'

        # test default
        create_training_pack.apply(throw=True,
                                   kwargs={"id_": "76561198055442516", "date_start": "1570412512",
                                           "date_end": "1570585312"}).get()

    @classmethod
    def teardown_class(cls):
        try:
            cls.thread.terminate()
        except:
            pass
        cls.thread.join()
        time.sleep(2)

import json
import time

import requests

from RLBotServer import start_server
from backend.tasks.training_packs.parsing.parse import Property
from backend.tasks.training_packs.training_packs import create_shots_from_replay
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
        shots, shot_docs = create_shots_from_replay("F030A92611E9E985F94B1D899E4B686F", "76561198055442516")
        print(shots)
        assert len(shots) == 3
        assert shots == [{'TimeLimit': Property("FloatProperty", "TimeLimit", 10), 'data': [
            {'ObjectArchetype': 'Archetypes.Ball.Ball_GameEditor', 'StartLocationX': 3937.68,
             'StartLocationY': -2632.57, 'StartLocationZ': 355.41, 'VelocityStartRotationP': 5425.193712861436,
             'VelocityStartRotationY': 20239.34, 'VelocityStartRotationR': 0.0, 'VelocityStartSpeed': 2618.49365},
            {'ObjectArchetype': 'Archetypes.GameEditor.DynamicSpawnPointMesh', 'LocationX': 1494.86,
             'LocationY': -4357.41, 'LocationZ': 16.99, 'RotationP': 1.48, 'RotationY': 5148.95, 'RotationR': 100.07},
            {'IsPC': True, 'LocationX': -599.9999, 'LocationY': -700.0001, 'LocationZ': 529.9955, 'RotationP': -1952,
             'RotationY': 14037, 'RotationR': 0}, None]}, {'TimeLimit': Property("FloatProperty", "TimeLimit", 10), 'data': [
            {'ObjectArchetype': 'Archetypes.Ball.Ball_GameEditor', 'StartLocationX': 3560.9, 'StartLocationY': 4044.22,
             'StartLocationZ': 762.8, 'VelocityStartRotationP': -354.37821656192733,
             'VelocityStartRotationY': -13087.26, 'VelocityStartRotationR': 0.0, 'VelocityStartSpeed': 2485.68518},
            {'ObjectArchetype': 'Archetypes.GameEditor.DynamicSpawnPointMesh', 'LocationX': 3632.49,
             'LocationY': -786.25, 'LocationZ': 17.01, 'RotationP': -2.87, 'RotationY': -14664.38, 'RotationR': 100.61},
            {'IsPC': True, 'LocationX': -599.9999, 'LocationY': -700.0001, 'LocationZ': 529.9955, 'RotationP': -1952,
             'RotationY': 14037, 'RotationR': 0}, None]}, {'TimeLimit': Property("FloatProperty", "TimeLimit", 10), 'data': [
            {'ObjectArchetype': 'Archetypes.Ball.Ball_GameEditor', 'StartLocationX': -1042.63,
             'StartLocationY': -529.47, 'StartLocationZ': 382.31,
             'VelocityStartRotationP': 11086.40211044948, 'VelocityStartRotationY': 7007.98,
             'VelocityStartRotationR': 0.0, 'VelocityStartSpeed': 1354.8541},
            {'ObjectArchetype': 'Archetypes.GameEditor.DynamicSpawnPointMesh', 'LocationX': -1522.84,
             'LocationY': -4006.8, 'LocationZ': 17.05, 'RotationP': -5.2, 'RotationY': 16477.59,
             'RotationR': 99.97},
            {'IsPC': True, 'LocationX': -599.9999, 'LocationY': -700.0001, 'LocationZ': 529.9955,
             'RotationP': -1952, 'RotationY': 14037, 'RotationR': 0}, None]}]

        @classmethod
        def teardown_class(cls):
            try:
                cls.thread.terminate()
            except:
                pass
            cls.thread.join()
            time.sleep(2)

import gzip
from typing import List

import matplotlib.pyplot as plt
import numpy as np
import os

from carball.analysis.utils import pandas_manager, proto_manager
from flask import current_app

from backend.blueprints.spa_api.errors.errors import ReplayNotFound, ErrorOpeningGame
from backend.blueprints.spa_api.service_layers.replay.replay_player import ReplayPlayer


class ReplayHeatmaps:

    @staticmethod
    def create_from_id(id_: str) -> 'ReplayHeatmaps':
        pickle_path = os.path.join(current_app.config['PARSED_DIR'], id_ + '.replay.pts')
        gzip_path = os.path.join(current_app.config['PARSED_DIR'], id_ + '.replay.gzip')
        replay_path = os.path.join(current_app.config['REPLAY_DIR'], id_ + '.replay')
        if os.path.isfile(replay_path) and not os.path.isfile(pickle_path):
            raise ReplayNotFound()

        try:
            with gzip.open(gzip_path, 'rb') as f:
                data_frame = pandas_manager.PandasManager.safe_read_pandas_to_memory(f)
            # with open(pickle_path, 'rb') as f:
            #     protobuf_game = proto_manager.ProtobufManager.read_proto_out_from_file(f)
        except Exception as e:
            raise ErrorOpeningGame(str(e))
        output = generate_heatmaps(data_frame)
        data = {}
        for player in output:
            arr = output[player]
            player_data = []
            for x in range(len(arr)):
                for y in range(len(arr[x])):
                    player_data.append({
                        'x': x,
                        'y': y,
                        'data': arr[x, y]
                    })
            data[player] = player_data

        return data

# will go into carball at some point
def generate_heatmaps(df):
    players = list(df.columns.levels[0])
    # players.remove("ball")
    players.remove("game")
    data = {}
    for player in players:
        # player = players[1]
        df_p = df[player][['pos_x', 'pos_y', 'pos_z']].dropna()
        val_x = df_p['pos_x']
        val_y = df_p['pos_y']
        val_z = df_p['pos_z']
        H, x, y = np.histogram2d(val_x, val_y, bins=[20, 30])
        # plt.imshow(np.log(H))
        # plt.colorbar()
        # plt.title(player)
        # plt.show()
        data[player] = H
    return data

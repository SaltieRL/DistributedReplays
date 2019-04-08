import gzip
import io
import math
import os

import numpy as np
import requests
from carball.analysis.utils import pandas_manager, proto_manager
from carball.generated.api.game_pb2 import Game
from flask import current_app

from backend.blueprints.spa_api.errors.errors import ReplayNotFound, ErrorOpeningGame

try:
    from config import GCP_BUCKET_GZIP_URL
except:
    GCP_BUCKET_GZIP_URL = ""


class ReplayHeatmaps:

    @staticmethod
    def create_from_id(id_: str, type_="positioning") -> 'ReplayHeatmaps':
        pickle_path = os.path.join(current_app.config['PARSED_DIR'], id_ + '.replay.pts')
        gzip_path = os.path.join(current_app.config['PARSED_DIR'], id_ + '.replay.gzip')
        replay_path = os.path.join(current_app.config['REPLAY_DIR'], id_ + '.replay')
        if os.path.isfile(replay_path) and not os.path.isfile(pickle_path):
            raise ReplayNotFound()
        if not os.path.isfile(gzip_path):
            if GCP_BUCKET_GZIP_URL != "":
                gz = gzip.GzipFile(fileobj=io.BytesIO(requests.get(GCP_BUCKET_GZIP_URL + id_ + '.replay.gzip').content),
                                   mode='rb')
            else:
                raise ReplayNotFound()
        else:
            gz = gzip.open(gzip_path, 'rb')
        try:
            data_frame = pandas_manager.PandasManager.safe_read_pandas_to_memory(gz)
            with open(pickle_path, 'rb') as f:
                protobuf_game = proto_manager.ProtobufManager.read_proto_out_from_file(f)
        except Exception as e:
            raise ErrorOpeningGame(str(e))
        finally:
            gz.close()
        # output = generate_heatmaps(data_frame, protobuf_game, type="hits")
        output = generate_heatmaps(data_frame, protobuf_game, type=type_)
        data = {}
        maxs = {}
        max_ = 0
        # for player in output:
        #     arr = output[player]
        #     player_data = []
        #     for x in range(len(arr[0])):
        #         for y in range(len(arr[0][x])):
        #             player_data.append({
        #                 'x': math.floor(arr[1][x] * 200 / 6000 + 250),
        #                 'y': math.floor(arr[2][y] * 200 / 6000 + 250),
        #                 'value': max(0, math.log(arr[0][x, y] + 1e-3))
        #             })
        #             max_ = max(math.log(arr[0][x, y] + 1e-3), max_)
        #     data[player] = player_data
        #     maxs[player] = max_
        if type_ == 'hits':
            return {'data': output, 'maxs': maxs}

        if type_ in ['hits']:
            log_scale = False
        else:
            log_scale = True
        width = 400 / 500
        for player in output:
            arr = output[player]
            player_data = []
            for x in range(len(arr[0])):
                for y in range(len(arr[0][x])):
                    if log_scale:
                        value = math.log(arr[0][x, y] + 1e-3)
                    else:
                        value = arr[0][x, y]
                    if value == 0:
                        continue
                    player_data.append({
                        'x': math.floor(arr[1][x] * width * 200 / 6000 + 125),
                        'y': math.floor(arr[2][y] * width * 200 / 6000 + 175),
                        'value': max(0, value)
                    })
                    max_ = max(value, max_)
            data[player] = player_data
            maxs[player] = max_

        return {'data': data, 'maxs': maxs}


# will go into carball at some point
# def generate_heatmaps(df):
#     players = list(df.columns.levels[0])
#     # players.remove("ball")
#     players.remove("game")
#     data = {}
#     for player in players:
#         # player = players[1]
#         df_p = df[player][['pos_x', 'pos_y', 'pos_z']].dropna()
#         val_x = df_p['pos_x']
#         val_y = df_p['pos_y']
#         val_z = df_p['pos_z']
#         H, x, y = np.histogram2d(val_x, val_y, bins=[20, 30])
#         # plt.imshow(np.log(H))
#         # plt.colorbar()
#         # plt.title(player)
#         # plt.show()
#         data[player] = (H, x, y)
#     return data

def generate_heatmaps(df, proto: Game = None, type='position'):
    players = list(df.columns.levels[0])
    if type != 'position':
        players.remove("ball")
    players.remove("game")
    data = {}
    width = 400 / 500
    for player in players:
        if type == 'positioning':
            # player = players[1]
            df_adjusted = df
        elif type in ['shots', 'hits']:
            if proto is None:
                raise Exception("Proto is none")
            player_id = None
            for proto_player in proto.players:
                if proto_player.name == player:
                    player_id = proto_player.id.id
            if player_id is None:
                continue
            if type == 'hits':
                proto_hits = [hit for hit in proto.game_stats.hits if hit.player_id.id == player_id]
            else:
                proto_hits = [hit for hit in proto.game_stats.hits if hit.player_id.id == player_id and hit.shot]
            # find hits
            hit_frames = [hit.frame_number for hit in proto_hits]
            print(player, hit_frames)
            # player = players[1]
            df_adjusted = df.iloc[hit_frames]
        elif type == 'boost':
            df_adjusted = df[df[player]["boost_active"] == True]
        elif type == 'boost collect':
            df_adjusted = df[df[player]["boost_collect"] == True]
        elif type == 'boost speed':
            df_adjusted = df[(df[player]["vel_x"] ** 2 + df[player]["vel_y"]) ** 0.5 > 14000]
        elif type == 'slow speed':
            df_adjusted = df[(df[player]["vel_x"] ** 2 + df[player]["vel_y"]) ** 0.5 < 7000]
        else:
            df_adjusted = df

        if type == 'hits':
            df_p = df_adjusted['ball'][['pos_x', 'pos_y', 'pos_z']].dropna()
            val_x = df_p['pos_x']
            val_y = df_p['pos_y']
            data[player] = [{
                'x': math.floor(x * width * 200 / 6000 + 125),
                'y': math.floor(y * width * 200 / 6000 + 175),
                'value': 1
            } for x, y in zip(val_x, val_y)]
        else:
            df_p = df_adjusted[player][['pos_x', 'pos_y', 'pos_z']].dropna()
            val_x = df_p['pos_x']
            val_y = df_p['pos_y']
            val_z = df_p['pos_z']
            H, x, y = np.histogram2d(val_x, val_y, bins=[20, 30])
            data[player] = (H, x, y)
    return data

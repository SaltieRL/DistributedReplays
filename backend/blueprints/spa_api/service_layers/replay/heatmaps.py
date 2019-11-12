import math

import numpy as np
import pandas as pd
from carball.generated.api.game_pb2 import Game

from backend.utils.file_manager import FileManager
from backend.blueprints.spa_api.service_layers.replay.enums import HeatMapType


class ReplayHeatmaps:

    @staticmethod
    def create_from_id(id_: str, type_=HeatMapType.POSITIONING) -> 'ReplayHeatmaps':
        data_frame = FileManager.get_pandas(id_)
        protobuf_game = FileManager.get_proto(id_)
        # output = generate_heatmaps(data_frame, protobuf_game, type="hits")
        width = 400 / 500
        step = 350.0
        # x_range = 4.05*10**3
        # y_range = 5.1*10**3
        x_range = 4.05*10**3
        y_range = 6.1*10**3
        x_bins = np.arange(-x_range, x_range, step)
        y_bins = np.arange(-y_range, y_range, step)

        output = generate_heatmaps(data_frame, protobuf_game, type_=type_, bins=[x_bins, y_bins])
        data = {}
        maxs = {}
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
        if type_ == HeatMapType.HITS:
            return {'data': output, 'maxs': maxs}

        if type_ in [HeatMapType.HITS]:
            log_scale = False
        else:
            log_scale = True

        for player in output:
            max_ = 0
            arr = output[player]
            player_data = []
            for x in range(len(arr[0])):
                for y in range(len(arr[0][x])):
                    if arr[0][x, y] == 0:
                        continue
                    if log_scale:
                        value = math.log(arr[0][x, y] + 1e-3) ** 1.8
                    else:
                        value = arr[0][x, y]
                    player_data.append({
                        'x': math.floor(arr[1][x] * width * 200 / 6000 + 130),
                        'y': math.floor(arr[2][y] * width * 200 / 6000 + 180),
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

def generate_heatmaps(df, proto: Game = None, type_=HeatMapType.POSITIONING, bins=[20, 30]):
    players = list(df.columns.levels[0])
    if type_ != HeatMapType.POSITIONING:
        players.remove("ball")
    players.remove("game")
    data = {}
    width = 400 / 500
    for player in players:
        if type_ == HeatMapType.POSITIONING:
            # player = players[1]
            if player == 'ball':
                df_adjusted = df.loc[~((df[player].pos_x == 0) & (df[player].pos_y == 0))]
            else:
                df_adjusted = df.loc[df.game.goal_number.notnull()]
        elif type_ in [HeatMapType.SHOTS, HeatMapType.HITS]:
            if proto is None:
                raise Exception("Proto is none")
            player_id = None
            for proto_player in proto.players:
                if proto_player.name == player:
                    player_id = proto_player.id.id
            if player_id is None:
                continue
            if type_ == HeatMapType.HITS:
                proto_hits = [hit for hit in proto.game_stats.hits if hit.player_id.id == player_id]
            else:
                proto_hits = [hit for hit in proto.game_stats.hits if hit.player_id.id == player_id and hit.shot]
            # find hits
            hit_frames = [hit.frame_number for hit in proto_hits]
            print(player, hit_frames)
            # player = players[1]
            df_adjusted = df.iloc[hit_frames]
        elif type_ == HeatMapType.BOOST:
            df_adjusted = df[df[player]["boost_active"] == True]
        elif type_ == HeatMapType.BOOST_COLLECT:
            df_adjusted = df[df[player]["boost_collect"] != False & df[player]["boost_collect"].isnull()]
        elif type_ == HeatMapType.BOOST_SPEED:
            df_adjusted = df[(df[player]["vel_x"] ** 2 + df[player]["vel_y"]) ** 0.5 > 14000]
        elif type_ == HeatMapType.SLOW_SPEED:
            df_adjusted = df[(df[player]["vel_x"] ** 2 + df[player]["vel_y"]) ** 0.5 < 7000]
        else:
            df_adjusted = df

        if type_ == HeatMapType.HITS:
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
            H, x, y = np.histogram2d(val_x, val_y, bins=bins)
            data[player] = (H, x, y)
    return data

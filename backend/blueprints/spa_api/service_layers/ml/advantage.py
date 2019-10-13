import os
from joblib import dump, load
import numpy as np
import pandas as pd
# Tensorflow
import tensorflow as tf
from tensorflow import keras
from keras.models import load_model
# Sklearn
from sklearn.preprocessing import MinMaxScaler
from typing import List

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.server_constants import *
from backend.blueprints.spa_api.service_layers.replay.replay_positions import ReplayPositions
from backend.utils.file_manager import FileManager
from carball.generated.api.game_pb2 import Game

try:
    from backend.blueprints.spa_api.service_layers.ml.config import ranges, model_path, droplist
except ImportError:
    print("No config.py file")
    raise ImportError
    # my config.py:
    # ranges = [(0, 3), (2, 5), (3, 7), (4, 8), (6, 10), (7, 12), (9, 14), (11, 16)]
    # droplist = ['z_0_dodge_active', 'z_0_jump_active', 'z_0_double_jump_active', 'o_0_dodge_active', 'o_0_jump_active',
    #             'o_0_double_jump_active', 'ball_rot_x', 'ball_rot_y', 'ball_rot_z', 'ball_ang_vel_x', 'ball_ang_vel_y',
    #             'ball_ang_vel_z', 'game_seconds_remaining']
    # model_path = 'models/'


def get_ordered_columns(players_per_team: int):
    """
    Return an ordered list of column names to be passed to a game dataframe.
    :param players_per_team: Determines how many player columns to return.
    :type players_per_team: int
    :return: A list of column names.
    :rtype: List[str]
    """
    x = players_per_team
    non_player = ['ball_pos_x', 'ball_pos_y', 'ball_pos_z', 'ball_rot_x', 'ball_rot_y', 'ball_rot_z',
                  'ball_vel_x', 'ball_vel_y', 'ball_vel_z', 'ball_ang_vel_x', 'ball_ang_vel_y', 'ball_ang_vel_z',
                  'game_seconds_remaining', 'game_goal_number']
    z_zero = ['z_0_pos_x', 'z_0_pos_y', 'z_0_pos_z', 'z_0_rot_x', 'z_0_rot_y', 'z_0_rot_z',
              'z_0_vel_x', 'z_0_vel_y', 'z_0_vel_z', 'z_0_ang_vel_x', 'z_0_ang_vel_y', 'z_0_ang_vel_z',
              'z_0_boost', 'z_0_boost_active', 'z_0_jump_active', 'z_0_double_jump_active', 'z_0_dodge_active',
              'z_0_is_demo']
    z_one = []
    z_two = []
    o_zero = []
    o_one = []
    o_two = []
    for col in z_zero:
        if x > 1:
            z_one.append(col.replace('0', '1', 1))
        if x > 2:
            z_two.append(col.replace('0', '2', 1))
        o_zero.append(col.replace('z', 'o', 1))
    if x > 1:
        for col in o_zero:
            o_one.append(col.replace('0', '1', 1))
            if x > 2:
                o_two.append(col.replace('0', '2', 1))

    columns_ordered = z_zero + z_one + z_two + o_zero + o_one + o_two + non_player
    return columns_ordered


def df_to_int(input_df, mul=False):
    """
    Shrink a dataframes size in memory while minimizing data loss.
    :param mul: Whether to multiply values to retain precision. Set to false if this is not the first time calling on the df.
    :type mul: bool
    :param input_df: The input game dataframe
    :type input_df: pd.DataFrame
    :return: A copy of the dataframe, with column types changed.
    :rtype: pd.DataFrame
    """
    df = input_df.copy(deep=True)
    sub_dict = {"pos": [1, np.int16], "rot": [1000, np.int16], "vel": [1, np.int16], "boost": [1, np.uint8],
                "active": [1, np.int8], "next": [1, np.int8], "is": [1, np.int8],
                "sec": [1, np.int16], "score": [1, np.int8]}
    for sub, ops in sub_dict.items():
        cols = [col for col in df.columns if sub in col]
        for col in cols:
            df[col] = (df[col] * (ops[0] ** mul)).astype(ops[1])
    return df


def mirror_inputs(input_df, num_players):
    # Only works for 1v1 right now!
    # Prepare flipping teams
    cols = input_df.columns.tolist()
    flipped_cols = cols[15:30] + cols[0:15] + cols[30:]
    df = input_df.copy()[flipped_cols]
    df.columns = cols
    # Get columns for flipping
    players = ['z_0_', 'o_0_', 'z_1_', 'o_1_', 'z_2_', 'o_2_', ]
    entities = (players[:num_players * 2])
    entities.append('ball_')
    flipping = ['pos_x', 'pos_y', 'vel_x', 'vel_y', 'ang_vel_x', 'ang_vel_y']
    for e in entities:
        if e is 'ball_':
            for col in flipping[:4]:
                df.loc[:, e + col] *= -1
        else:
            for col in flipping:
                df.loc[:, e + col] *= -1
            # Also 'encode' by subtracting 10 so the values don't get picked up by the second query
            col_type = df[e + 'rot_y'].dtype
            if col_type == np.int16:  # Rotation has been multiplied by 1000
                my_pi = np.pi * 1000
            else:
                assert (col_type == np.float32)
                my_pi = np.pi
            df.loc[df[e + 'rot_y'] > 0, e + 'rot_y'] -= (my_pi + 10000)
            df.loc[(df[e + 'rot_y'] < 0) & (df[e + 'rot_y'] > -my_pi), e + 'rot_y'] += my_pi
            # 'Decode' the first change
            df.loc[df[e + 'rot_y'] < -my_pi, e + 'rot_y'] += 10000
            df[e + 'rot_y'] = df[e + 'rot_y'].astype(col_type)
    return df


def get_game_df_prepared(df, proto_game: Game = None):
    # Flatten columns
    gdf = df.copy()
    gdf.columns = gdf.columns.to_flat_index()
    game_has_overtime = False
    if len(gdf.columns) != 65:
        if len(gdf.columns) == 66:
            if ('game', 'is_overtime') in gdf.columns:
                game_has_overtime = True
            else:
                print("Column value error.")
                raise ValueError

    # Player Data
    # ~1 in 3 games have the blue team as team "1" instead of "0". We have to fix the team order in these cases.
    team_names = [[], []]
    game = proto_game.game_metadata
    if proto_game.teams[1].is_orange:
        team_index = [0, 1]
    else:  # Reverse the indexing
        team_index = [1, 0]

    for player in proto_game.players:
        if player.is_orange:
            team_names[team_index[1]].append(player.name)
        else:
            team_names[team_index[0]].append(player.name)

    # Dictionary for rename
    rename_dict = {}
    for tup in gdf.columns:
        # Need to change all the player values and make them in order
        if tup[0] in team_names[0]:
            i = team_names[0].index(tup[0])
            sub = 'z_' + str(i) + '_' + tup[1]

        elif tup[0] in team_names[1]:
            i = team_names[1].index(tup[0])
            sub = 'o_' + str(i) + '_' + tup[1]

        else:
            sub = tup[0] + '_' + tup[1]

        rename_dict[tup] = sub

    gdf = gdf.rename(rename_dict, axis='columns')

    num_players = len(team_names[0])
    # Add demo columns
    for team in ['z_', 'o_']:
        for i in range(num_players):
            gdf[team + str(i) + '_is_demo'] = np.zeros(len(gdf))

    gdf = gdf[get_ordered_columns(num_players)]
    # We would call add_game_columns func here if we ever needed those values

    # forward fill demos (Single player NA), then fill empty values (Ball values)
    for team in ['z_', 'o_']:
        for i in range(num_players):
            num = str(i) + '_'
            gen_list = ['pos_x', 'pos_y', 'pos_z', 'rot_x', 'rot_y', 'rot_z', 'vel_x', 'vel_y', 'vel_z',
                        'ang_vel_x', 'ang_vel_y',
                        'ang_vel_z', 'boost_active', 'jump_active', 'double_jump_active', 'dodge_active']
            fill_list = [team + num + entry for entry in gen_list]
            # Change demo column using presence of NA values
            gdf[team + num + 'is_demo'] = gdf[fill_list].isna().replace({True: 1, False: 0}).mean(axis=1)
            # Turn NA values into value before demo
            for _ in fill_list:
                gdf.loc[:, fill_list] = gdf.loc[:, fill_list].ffill(axis=0)

    gdf = gdf.drop(['game_goal_number'], axis=1)
    gdf = gdf.fillna(0)
    # Change active values to boolean
    gdf['z_0_jump_active'] = ((gdf['z_0_jump_active'] % 2) != 0).astype(int)
    gdf['o_0_jump_active'] = ((gdf['o_0_jump_active'] % 2) != 0).astype(int)
    gdf['z_0_double_jump_active'] = ((gdf['z_0_double_jump_active'] % 2) != 0).astype(int)
    gdf['o_0_double_jump_active'] = ((gdf['o_0_double_jump_active'] % 2) != 0).astype(int)
    gdf['z_0_dodge_active'] = ((gdf['z_0_dodge_active'] % 2) != 0).astype(int)
    gdf['o_0_dodge_active'] = ((gdf['o_0_dodge_active'] % 2) != 0).astype(int)
    gdf = gdf.replace({True: 1, False: 0})
    gdf = df_to_int(gdf, mul=True)

    return gdf


def predict_on_game(df, proto_game: Game = None, num_players=1):
    gdf = get_game_df_prepared(df, proto_game)
    input_df = gdf.copy()
    orange = pd.DataFrame(0, index=input_df.index, columns=range(0, 16))
    blue = pd.DataFrame(0, index=input_df.index, columns=range(0, 16))
    x = input_df.drop(droplist, axis=1)
    mx = mirror_inputs(x.copy(), num_players)
    scaler = load(CODE_FOLDER + model_path + 'scaler.joblib')
    x = scaler.transform(x)
    mx = scaler.transform(mx)
    # Use models
    models = []
    preds = []
    count = 0
    coverage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for mp in os.listdir(CODE_FOLDER + model_path):
        if 'scaler.joblib' in mp:
            continue
        r_str = f"{ranges[count][0]}-{ranges[count][1]}"

        model = load_model(CODE_FOLDER + model_path + mp, compile=False)
        models.append(model)
        pred = model.predict_proba(x)[:, 0]
        mpred = model.predict_proba(mx)[:, 0]
        # Add and average the predictions across seconds range
        for second in range(ranges[count][0], ranges[count][1]):
            coverage[second] += 1
            blue[second] -= mpred
            orange[second] += pred
        count += 1
    for index in range(len(coverage)):
        blue[index] /= coverage[index]
        orange[index] /= coverage[index]
    return blue, orange


def predict_on_id(id_: str, query_params=None):
    filter_frames = None
    filter_frame_start = None
    filter_frame_count = None
    if query_params is not None and 'frame' in query_params:
        filter_frames = query_params['frame']
    if query_params is not None and 'frame_start' in query_params and 'frame_count' in query_params:
        filter_frame_start = query_params['frame_start']
        filter_frame_count = query_params['frame_count']

    data_frame = FileManager.get_pandas(id_)
    if filter_frames is not None:
        data_frame = ReplayPositions.filter_frames(filter_frames, data_frame)
    if filter_frame_start is not None and filter_frame_count is not None:
        data_frame = ReplayPositions.filter_frames_range(filter_frame_start, filter_frame_count, data_frame)

    protobuf_game = FileManager.get_proto(id_)
    # Get MMRs (later)
    # game = session.query(Game).filter(Game.hash == id_).first()
    # game.mmrs
    # mmrs = {'min': 3000, 'max': 0, 'avg': 0}
    # non_zero = 0
    # for mmr in game.mmrs:
    #     if mmr == 0:
    #         continue
    #     non_zero += 1
    #     if mmr < mmrs['min']:
    #         mmrs['min'] = mmr
    #     if mmr > mmrs['max']:
    #         mmrs['max'] = mmr
    #     mmrs['avg'] += mmr
    # mmrs['avg'] /= non_zero

    # Predict with Models
    blue, orange = predict_on_game(data_frame, protobuf_game, 1)  # third arg len of protobuf.players/2?
    return blue.values.tolist(), orange.values.tolist()

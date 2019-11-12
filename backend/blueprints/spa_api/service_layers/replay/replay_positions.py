from typing import List

from backend.utils.file_manager import FileManager
from backend.blueprints.spa_api.service_layers.replay.replay_player import ReplayPlayer
import numpy as np


class ReplayPositions:
    def __init__(self, id_: str,
                 ball: List[float], players: List[ReplayPlayer], colors: List[int], names: List[str],
                 frames: List[float]):
        self.id = id_

        self.ball = ball
        self.players = players
        self.colors = colors
        self.names = names
        self.frames = frames

    @staticmethod
    def create_from_id(id_: str, query_params=None) -> 'ReplayPositions':
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

        cs = ['pos_x', 'pos_y', 'pos_z']
        rot_cs = ['rot_x', 'rot_y', 'rot_z']

        ball = data_frame['ball']
        ball_df = ball[cs].fillna(-100)

        players = protobuf_game.players
        names = [player.name for player in players]

        def process_player_df(game) -> List[ReplayPlayer]:
            player_data = []
            # flipping = ['pos_x', 'vel_x', 'ang_vel_x', 'rot_z']
            # rotating = ['rot_x']
            for i in range(len(names)):
                player = names[i]
                player_df = data_frame[player].copy()
                # if i == 1:
                #     for col in flipping:
                #         player_df.loc[:, col] = data_frame[names[0]][col] * -1
                #     for col in rotating:
                #         pass
                #         # player_df.loc[player_df[col] > 0, col] -= (my_pi + 10000)
                #         # player_df.loc[(player_df[col] < 0) & (player_df[col] > -my_pi), col] += my_pi
                #         # # 'Decode' the first change
                #         # player_df.loc[player_df[col] < -my_pi, col] += 10000
                #         # player_df.loc[player_df[col] > 0, col] -= (my_pi + 10000)
                #         # player_df.loc[(player_df[col] < 0) & (player_df[col] > -my_pi), col] += my_pi
                #         # # 'Decode' the first change
                #         # player_df.loc[player_df[col] < -my_pi, col] += 10000
                #     player_df['rot_y'] = np.pi - player_df['rot_y']
                #     # player_df['rot_x'] = 0 - player_df['rot_x']
                #     # player_df['rot_z'] = 0 - player_df['rot_z']
                player_positions = player_df[cs + rot_cs + ['boost_active']].fillna(-100)
                player_data.append(player_positions.values.tolist())
            return player_data

        players_data = process_player_df(protobuf_game)
        game_frames = data_frame['game'][['delta', 'seconds_remaining', 'time']].fillna(-100)

        return ReplayPositions(
            id_=id_,
            ball=ball_df.values.tolist(),
            players=players_data,
            colors=[player.is_orange for player in players],
            names=[player.name for player in players],
            frames=game_frames.values.tolist()
        )

    @staticmethod
    def filter_frames(frames, data_frame):
        return data_frame.loc[data_frame.index.isin(frames)]

    @staticmethod
    def filter_frames_range(fmin, count, data_frame):
        return data_frame.loc[(data_frame.index >= fmin) & (data_frame.index < fmin + count)]

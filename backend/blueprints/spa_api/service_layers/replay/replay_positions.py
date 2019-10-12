from typing import List

from backend.utils.file_manager import FileManager
from backend.blueprints.spa_api.service_layers.replay.replay_player import ReplayPlayer


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
            for player in names:
                data_frame[player].loc[:, rot_cs] = data_frame[player][rot_cs] / 65536.0 * 2 * 3.14159265
                data_frame[player].loc[:, 'pos_x'] = data_frame[player]['pos_x']
                data_frame[player].loc[:, 'pos_y'] = data_frame[player]['pos_y']
                data_frame[player].loc[:, 'pos_z'] = data_frame[player]['pos_z']
                player_positions = data_frame[player][cs + rot_cs + ['boost_active']].fillna(-100)
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

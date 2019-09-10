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
        data_frame = FileManager.get_pandas(id_)
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
                player_data.append(data_frame[player][cs + rot_cs + ['boost_active']].fillna(-100).values.tolist())
            return player_data

        players_data = process_player_df(protobuf_game)
        player_frames = data_frame['game'][['delta', 'seconds_remaining', 'time']].fillna(-100)

        if query_params is not None and 'frame' in query_params:
            ball_df, player_frames = ReplayPositions.filter_frames(ball_df, player_frames, query_params)

        return ReplayPositions(
            id_=id_,
            ball=ball_df.values.toList(),
            players=players_data,
            colors=[player.is_orange for player in players],
            names=[player.name for player in players],
            frames=player_frames.values.tolist()
        )

    @classmethod
    def filter_frames(cls, ball_df, player_frames, query_params):
        frames = query_params['frame']
        return ball_df.loc[ball_df.index.isin(frames)], player_frames.loc[player_frames.index.isin(frames)]

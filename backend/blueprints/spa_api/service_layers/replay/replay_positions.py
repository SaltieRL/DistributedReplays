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
    def create_from_id(id_: str) -> 'ReplayPositions':
        data_frame = FileManager.get_pandas(id_)
        protobuf_game = FileManager.get_proto(id_)

        cs = ['pos_x', 'pos_y', 'pos_z']
        rot_cs = ['rot_x', 'rot_y', 'rot_z']

        ball = data_frame['ball']
        ball_df = ball[cs].fillna(-100).values.tolist()
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
        frame_data = data_frame['game'][['delta', 'seconds_remaining', 'time']].fillna(-100).values.tolist()

        return ReplayPositions(
            id_=id_,
            ball=ball_df,
            players=players_data,
            colors=[player.is_orange for player in players],
            names=[player.name for player in players],
            frames=frame_data
        )

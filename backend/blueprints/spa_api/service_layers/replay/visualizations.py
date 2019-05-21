import gzip
import os

import numpy as np
from carball.analysis.utils import pandas_manager, proto_manager
from flask import current_app

from backend.blueprints.spa_api.errors.errors import ReplayNotFound, ErrorOpeningGame
from backend.utils.cloud_handler import download_df, download_proto

FULL_BOOST_POSITIONS = np.array([
    (3000, -4100),
    (3000, 0),
    (3000, 4100),
    (-3000, -4100),
    (-3000, 0),
    (-3000, 4100),
])

class Visualizations:

    @staticmethod
    def create_from_id(id_: str) -> 'ReplayHeatmaps':
        pickle_path = os.path.join(current_app.config['PARSED_DIR'], id_ + '.replay.pts')
        gzip_path = os.path.join(current_app.config['PARSED_DIR'], id_ + '.replay.gzip')
        replay_path = os.path.join(current_app.config['REPLAY_DIR'], id_ + '.replay')
        if os.path.isfile(replay_path) and not os.path.isfile(pickle_path):
            raise ReplayNotFound()
        if not os.path.isfile(gzip_path):
            df = download_df(id_)
            protobuf_game = download_proto(id_)
        else:
            try:
                with gzip.open(gzip_path, 'rb') as gz:
                    df = pandas_manager.PandasManager.safe_read_pandas_to_memory(gz)
                with open(pickle_path, 'rb') as f:
                    protobuf_game = proto_manager.ProtobufManager.read_proto_out_from_file(f)
            except Exception as e:
                raise ErrorOpeningGame(str(e))
        id_to_name_map = {p.id.id: p.name for p in protobuf_game.players}
        if protobuf_game.teams[0].is_orange:
            orange_team = protobuf_game.teams[0]
        else:
            orange_team = protobuf_game.teams[1]
        orange = [id_to_name_map[pl.id] for pl in orange_team.player_ids]
        counts = [[] for a in range(FULL_BOOST_POSITIONS.shape[0])]
        players = list(df.columns.levels[0])
        players.remove("ball")
        players.remove("game")
        for player in players:
            player_df = df[player]
            boost_pickup_frames = player_df[player_df.boost_collect == True].index.values
            for frame in boost_pickup_frames:
                try:
                    position = player_df.iloc[frame].loc[['pos_x', 'pos_y']]
                except:
                    continue
                distances_from_boosts = np.sqrt(
                    np.square(FULL_BOOST_POSITIONS - position.values).sum(axis=1, dtype=np.float32))
                idx: int = np.argmin(distances_from_boosts)
                counts[idx].append(BoostPickup(player, int(player in orange), int(frame)).__dict__)
        return counts


class BoostPickup:
    def __init__(self, playerName: str, playerTeam: int, frame: int):
        self.playerName = playerName
        self.playerTeam = playerTeam
        self.frame = frame

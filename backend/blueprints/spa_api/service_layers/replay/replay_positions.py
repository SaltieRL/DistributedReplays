import gzip
import os

import pandas as pd

from typing import List, cast
from flask import current_app

from carball.analysis.utils import proto_manager, pandas_manager
from backend.database.objects import Game, PlayerGame
from .replay_player import ReplayPlayer
from ..utils import sort_player_games_by_team_then_id
from ...errors.errors import ReplayNotFound, ErrorOpeningGame


class ReplayPositions:
    def __init__(self, id_: str,
                 ball, players, colors, names,
                 frames):
        self.id = id_

        self.ball = ball
        self.players = players
        self.colors = colors
        self.names = names
        self.frames = frames

    @staticmethod
    def create_from_id(id_: str) -> 'ReplayPositions':
        pickle_path = os.path.join(current_app.config['PARSED_DIR'], id_ + '.replay.pts')
        gzip_path = os.path.join(current_app.config['PARSED_DIR'], id_ + '.replay.gzip')
        replay_path = os.path.join(current_app.config['REPLAY_DIR'], id_ + '.replay')
        if os.path.isfile(replay_path) and not os.path.isfile(pickle_path):
            raise ReplayNotFound()

        try:
            with gzip.open(gzip_path, 'rb') as f:
                data_frame = pandas_manager.PandasManager.safe_read_pandas_to_memory(f)
            with open(pickle_path, 'rb') as f:
                g = proto_manager.ProtobufManager.read_proto_out_from_file(f)
        except Exception as e:
            raise ErrorOpeningGame(str(e))

        field_ratio = 5140.0 / 4120
        x_mult = 100.0 / 4120
        y_mult = 100.0 / 5140 * field_ratio
        z_mult = 100.0 / 2000
        cs = ['pos_x', 'pos_y', 'pos_z']
        rot_cs = ['rot_x', 'rot_y', 'rot_z']
        ball = data_frame['ball']
        # ball['pos_x'] = ball['pos_x'] * x_mult
        # ball['pos_y'] = ball['pos_y'] * y_mult
        # ball['pos_z'] = ball['pos_z'] * z_mult
        ball_df = ball[cs].fillna(-100).values.tolist()
        players = g.players
        names = [p.name for p in players]

        def process_player_df(game):
            d = []
            for p in names:
                data_frame[p].loc[:, rot_cs] = data_frame[p][rot_cs] / 65536.0 * 2 * 3.14159265
                data_frame[p].loc[:, 'pos_x'] = data_frame[p]['pos_x'] * x_mult
                data_frame[p].loc[:, 'pos_y'] = data_frame[p]['pos_y'] * y_mult
                data_frame[p].loc[:, 'pos_z'] = data_frame[p]['pos_z'] * z_mult
                d.append(data_frame[p][cs + rot_cs + ['boost_active']].fillna(-100).values.tolist())
            return d

        players_data = process_player_df(g)
        frame_data = data_frame['game'][['delta', 'seconds_remaining', 'time']].fillna(-100).values.tolist()

        return ReplayPositions(
            id_=id_,
            ball=ball_df,
            players=players_data,
            colors=[p.is_orange for p in players],
            names=[p.name for p in players],
            frames=frame_data
        )

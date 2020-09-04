import glob
import os

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from sqlalchemy import inspect

from backend.database.objects import PlayerGame


def object_as_dict(obj):
    return {c.key: getattr(obj, c.key)
            for c in inspect(obj).mapper.column_attrs}


num_columns = 67
n_hidden = 32


class RankPredictorEnsemble(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(num_columns, n_hidden),
            nn.ReLU(),
            nn.Linear(n_hidden, n_hidden // 2),
            nn.ReLU(),
            nn.Linear(n_hidden // 2, 1),
            nn.Sigmoid()
        )

    def forward(self, game_state):
        game_state = torch.from_numpy(game_state).float()
        return self.layers(game_state)


class RankPredictor:
    # Loading
    # MODEL_DIR = os.path.abspath(os.path.join('..', '..', '..', '..', '..', 'data', 'models'))
    MODEL_DIR = os.path.abspath(os.path.join('data', 'models'))
    models = {}
    maxs = {}
    mins = {}

    def __init__(self):
        possible_playlists = [playlist for playlist in os.listdir(self.MODEL_DIR) if
                              os.path.isdir(os.path.join(self.MODEL_DIR, playlist))]
        for playlist_dir in possible_playlists:
            self.models[playlist_dir] = {}
            playlist_loc = os.path.join(self.MODEL_DIR, playlist_dir)
            # Load models
            for model in sorted(glob.glob(os.path.join(playlist_loc, '*.mdl'))):
                state = torch.load(model, map_location='cpu')
                m = RankPredictorEnsemble()
                m.load_state_dict(state)
                self.models[playlist_dir][os.path.basename(model).split('.')[0]] = m
            self.maxs[playlist_dir] = pd.read_csv(os.path.join(playlist_loc, 'maxs.csv'), index_col=0, squeeze=True,
                                                  header=None)
            self.mins[playlist_dir] = pd.read_csv(os.path.join(playlist_loc, 'mins.csv'), index_col=0, squeeze=True,
                                                  header=None)

    @staticmethod
    def process_input_data(input_, maxs, mins):
        # input_columns = ['saves', 'total_aerials',
        #                  'time_at_boost_speed', 'time_at_slow_speed', 'average_speed',
        #                  'boost_usage', 'average_hit_distance', 'ball_hit_forward', 'won_turnovers',
        #                  'num_stolen_boosts']  #
        ignore = ['total_saves', 'is_bot', 'time_in_game', 'car']
        input_columns = list(input_.axes[0][-num_columns - len(ignore):])
        nonzero = input_  # [input_['time_in_game'] > 0]
        input = nonzero[input_columns].div(nonzero['time_in_game'], axis=0)
        input = input.drop(ignore).fillna(0)
        # assert all([c1 == c2 for c1, c2 in zip(input.axes[0], columns)])
        #     for c in input.columns:
        #         if (input[c].max()-input[c].min()) == 0:
        #             print(c)
        #             input = input.drop(c, axis=1)
        # if maxs is None or mins is None:
        #     mins = input.min()
        #     maxs = input.max()
        input = (input - mins) / (maxs - mins)
        input = input.fillna(0.0)
        input = input.replace([np.inf, -np.inf], 0.0)
        output = nonzero['rank']
        return input, output, maxs, mins

    def convert_sql_object_to_numpy(self, obj: PlayerGame, playlist: int):
        playlist = str(playlist)
        obj = object_as_dict(obj)
        a = pd.Series(obj)
        input, _, __, ___ = self.process_input_data(a, self.maxs[playlist], self.mins[playlist])
        obj = input.values
        return obj

    def predict_rank(self, x: PlayerGame, playlist: int) -> int:
        print(playlist)
        x = self.convert_sql_object_to_numpy(x, playlist)
        result = pd.DataFrame(index=list(range(len(x))))
        if str(playlist) not in self.models:
            return None
        models = self.models[str(playlist)]
        for rank, m in models.items():
            result = result.merge(
                pd.Series(100 * m(x.astype(float)).detach().cpu().numpy(),
                          name=str(rank)).to_frame(), left_index=True, right_index=True)
        print(result)
        result = (result > 50).apply(lambda x: int(x.idxmin()), axis=1).values
        return int(result[0])


model_holder = RankPredictor()

if __name__ == '__main__':
    from backend.database.startup import lazy_startup

    pr = RankPredictor()
    session_factory = lazy_startup()

    s = session_factory()

    for o in s.query(PlayerGame)[:20]:
        print(o.name, o.rank)
        print(pr.predict_rank(o))
    s.close()

import glob
import pickle
import os
import sys

replay_lib = os.path.join(os.path.basename(__file__), '..', 'replayanalysis')
sys.path.append(replay_lib)
from replayanalysis.analysis.saltie_game.saltie_game import SaltieGame


def should_process_file(obj: SaltieGame):
    return 'turnovers' not in obj.stats


def process_file(obj: SaltieGame):
    from ..replayanalysis.analysis.stats.possession.turnovers import TurnoverStat
    turnovers = TurnoverStat.get_player_turnovers(obj)
    obj.stats['turnovers'] = turnovers
    return obj


if __name__ == '__main__':
    files = glob.glob(os.path.join(os.path.basename(__file__), '..', 'data', 'parsed', '*.pkl'))
    for f in files:
        with open(f, 'rb') as fo:
            pkl = pickle.load(fo)
        if should_process_file(pkl):
            result = process_file(pkl)
            with open(f, 'wb') as out:
                pickle.dump(result, out)
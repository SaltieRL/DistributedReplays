import glob
import os
import pickle

from carball.analysis.saltie_game.saltie_game import SaltieGame
from carball.analysis.stats.possession.turnovers import TurnoverStat


def should_process_file(obj: SaltieGame):
    return 'turnovers' not in obj.stats


def process_file(obj: SaltieGame):
    turnovers = TurnoverStat.get_player_turnovers(obj)
    obj.stats['turnovers'] = turnovers
    return obj


if __name__ == '__main__':
    files = glob.glob(os.path.join(os.path.dirname(__file__), '..', 'data', 'parsed', '*.pkl'))
    print('Processing', len(files), 'files')
    for i, f in enumerate(files):
        print(i, '/', len(files))
        with open(f, 'rb') as fo:
            try:
                pkl = pickle.load(fo)
            except EOFError:
                print('error opening', os.path.basename(f))
                fo.close()
                continue
        if should_process_file(pkl):
            result = process_file(pkl)
            with open(f, 'wb') as out:
                pickle.dump(result, out)

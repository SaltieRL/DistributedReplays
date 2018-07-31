import glob
import pickle
import os
import sys

replay_lib = os.path.join(os.path.basename(__file__), '..', 'replayanalysis')
sys.path.append(replay_lib)


def process_file(obj):
    return obj


if __name__ == '__main__':
    files = glob.glob(os.path.join(os.path.basename(__file__), '..', 'parsed', '*.pkl'))
    for f in files:
        with open(f, 'rb') as fo:
            result = process_file(pickle.load(fo))
        with open(f, 'wb') as fo:
            pickle.dump(result, fo)

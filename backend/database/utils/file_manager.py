import gzip
import os
from enum import Enum

from carball.analysis.utils import proto_manager, pandas_manager

from blueprints.spa_api.errors.errors import ReplayNotFound, ErrorOpeningGame
from utils.checks import log_error
from utils.cloud_handler import download_proto, download_df, download_replay

replay_directory = 'REPLAY_DIR'
parsed_directory = 'PARSED_DIR'


class BucketType(Enum):
    PANDAS = 1
    PROTO = 2
    REPLAY = 3


def get_replay_path(current_app, replay_id: str):
    return os.path.join(current_app.config[replay_directory], replay_id + '.replay')


def get_proto_path(current_app, replay_id: str):
    return os.path.join(current_app.config[parsed_directory], replay_id + '.replay.pts')


def get_pandas_path(current_app, replay_id: str):
    return os.path.join(current_app.config[parsed_directory], replay_id + '.replay.gzip')


def get_replay(current_app, replay_id):
    get_or_download(get_replay_path(current_app, replay_id),
                    lambda: download_replay(replay_id),
                    lambda item_path: open(item_path, 'rb'))


def get_proto(current_app, replay_id):
    get_or_download(get_replay_path(current_app, replay_id),
                    lambda: download_proto(replay_id),
                    lambda item_path: proto_manager.ProtobufManager.read_proto_out_from_file(open(item_path, 'rb')))


def get_pandas(current_app, replay_id):
    get_or_download(get_pandas_path(current_app, replay_id),
                    lambda: download_df(replay_id),
                    lambda item_path: pandas_manager.PandasManager.safe_read_pandas_to_memory(gzip.open(item_path, 'rb')))


def get_or_download(item_path, download_lambda, open_lambda):
    if not os.path.isfile(item_path):
        try:
            return download_lambda()
        except ReplayNotFound as e:
            log_error(e)
            raise e
        except Exception as e:
            log_error(e)
            raise ReplayNotFound()
    try:
        return open_lambda(item_path)
    except Exception as e:
        log_error(e)
        raise ErrorOpeningGame(str(e))

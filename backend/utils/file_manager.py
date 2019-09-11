import gzip
import os
from enum import Enum

from carball.analysis.utils import proto_manager, pandas_manager

from backend.blueprints.spa_api.errors.errors import ReplayNotFound, ErrorOpeningGame
from backend.utils.logging import ErrorLogger
from backend.utils.cloud_handler import download_proto, download_df, download_replay
from backend.server_constants import BASE_FOLDER


class BucketType(Enum):
    PANDAS = 1
    PROTO = 2
    REPLAY = 3


DEFAULT_REPLAY_FOLDER = os.path.join(BASE_FOLDER, 'data', 'rlreplays')
DEFAULT_PARSED_FOLDER = os.path.join(BASE_FOLDER, 'data', 'parsed')


class FileManager:
    @staticmethod
    def get_default_parse_folder():
        return DEFAULT_PARSED_FOLDER

    @staticmethod
    def get_default_replay_folder():
        return DEFAULT_REPLAY_FOLDER

    @staticmethod
    def get_replay_path(replay_id: str):
        return os.path.join(FileManager.get_default_replay_folder(), replay_id + '.replay')

    @staticmethod
    def get_proto_path(replay_id: str):
        return os.path.join(FileManager.get_default_parse_folder(), replay_id + '.replay.pts')

    @staticmethod
    def get_pandas_path(replay_id: str):
        return os.path.join(FileManager.get_default_parse_folder(), replay_id + '.replay.gzip')

    @staticmethod
    def get_replay(replay_id):
        return FileManager.get_or_download(FileManager.get_replay_path(replay_id),
                                           lambda: download_replay(replay_id),
                                           lambda item_path: open(item_path, 'rb'))

    @staticmethod
    def get_proto(replay_id):
        return FileManager.get_or_download(FileManager.get_proto_path(replay_id),
                                           lambda: download_proto(replay_id),
                                           lambda item_path: proto_manager.ProtobufManager.read_proto_out_from_file(open(item_path, 'rb')))

    @staticmethod
    def get_pandas(replay_id):
        return FileManager.get_or_download(FileManager.get_pandas_path(replay_id),
                                           lambda: download_df(replay_id),
                                           lambda item_path: pandas_manager.PandasManager.safe_read_pandas_to_memory(gzip.open(item_path, 'rb')))

    @staticmethod
    def get_or_download(item_path, download_lambda, open_lambda):
        if not os.path.isfile(item_path):
            try:
                return download_lambda()
            except ReplayNotFound as e:
                ErrorLogger.log_error(e)
                raise e
            except Exception as e:
                ErrorLogger.log_error(e)
                raise ReplayNotFound()
        try:
            return open_lambda(item_path)
        except Exception as e:
            ErrorLogger.log_error(e)
            raise ErrorOpeningGame(str(e))

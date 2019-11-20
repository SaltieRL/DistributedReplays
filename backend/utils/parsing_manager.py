import gzip
import os
import shutil
import traceback
from typing import Optional

from carball import analyze_replay_file
from carball.analysis.analysis_manager import AnalysisManager

from backend.utils.logger import ErrorLogger


def write_replay_to_disk(analysis_manager: AnalysisManager, parsed_data_path: str):
    # Temp write file to the original filename location
    if not os.path.isdir(os.path.dirname(parsed_data_path)):
        os.makedirs(os.path.dirname(parsed_data_path))
    with open(parsed_data_path + '.pts', 'wb') as fo:
        analysis_manager.write_proto_out_to_file(fo)
    with gzip.open(parsed_data_path + '.gzip', 'wb') as fo:
        analysis_manager.write_pandas_out_to_file(fo)


def parse_replay_wrapper(replay_to_parse_path: str,
                         parsed_data_path: str,
                         failed_dir: str,
                         force_reparse: bool,
                         logger, query_params=None) -> Optional[AnalysisManager]:
    """
    Parses a replay with the given parameters.
    :param replay_to_parse_path:  The path where the replay that is being parsed is stored
    :param parsed_data_path:  The path where the post parsing data will be stored
    :param failed_dir:  The path where we will store a replay that failed to parse
    :param force_reparse: If true the replay will parse even if it has already been parsed before.
    :param logger:  The logger that is logging the error messages
    :return: An analysis manager if the replay was successfully parsed.  It will return None if the replay has already been parsed.
    """
    # Todo preparse replay ID here to save on extra parsing and on locks.  (remember to delete locks older than 1 day)
    if os.path.isfile(parsed_data_path) and not force_reparse:
        return
    # try:
    try:
        analysis_manager = analyze_replay_file(replay_to_parse_path)  # type: AnalysisManager
    except Exception as e:
        if not os.path.isdir(failed_dir):
            os.makedirs(failed_dir)
        shutil.move(replay_to_parse_path, os.path.join(failed_dir, os.path.basename(replay_to_parse_path)))
        with open(os.path.join(failed_dir, os.path.basename(replay_to_parse_path) + '.txt'), 'a') as f:
            f.write(str(e))
            f.write(traceback.format_exc())
        payload = {
            'replay_uuid': os.path.basename(replay_to_parse_path),
            'error_type': type(e).__name__,
            'stack': traceback.format_exc(),
            'game_hash': None
        }
        ErrorLogger.log_replay_error(payload, query_params)
        raise e
    try:
        write_replay_to_disk(analysis_manager, parsed_data_path)
    except Exception as e:
        ErrorLogger.log_error(e, logger=logger)
        with open(os.path.join(failed_dir, os.path.basename(replay_to_parse_path) + '.txt'), 'a') as f:
            f.write(str(e))
            f.write(traceback.format_exc())

    return analysis_manager

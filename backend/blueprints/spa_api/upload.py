import base64
import gzip
import io
import logging
import os
import shutil
import uuid

from carball.analysis.utils.proto_manager import ProtobufManager
from flask import request, current_app, jsonify
from werkzeug.utils import secure_filename

from .errors.errors import CalculatedError
from .spa_api import bp
from backend.database.utils.utils import convert_pickle_to_db, add_objs_to_db
from backend.tasks import celery_tasks
from backend.tasks.utils import get_queue_length

logger = logging.getLogger(__name__)


@bp.route('/upload', methods=['POST'])
def api_upload_replays():
    uploaded_files = request.files.getlist("replays")
    logger.info(f"Uploaded files: {uploaded_files}")
    if uploaded_files is None or 'replays' not in request.files or len(uploaded_files) == 0:
        raise CalculatedError(400, 'No files uploaded')
    task_ids = []

    for file in uploaded_files:
        file.seek(0, os.SEEK_END)
        file_length = file.tell()
        if file_length > 5000000:
            continue
        if not file.filename.endswith('replay'):
            continue
        file.seek(0)
        ud = uuid.uuid4()
        filename = os.path.join(current_app.config['REPLAY_DIR'], secure_filename(str(ud) + '.replay'))
        file.save(filename)
        lengths = get_queue_length()  # priority 0,3,6,9
        if lengths[1] > 1000:
            result = celery_tasks.parse_replay_gcp(os.path.abspath(filename))
        else:
            result = celery_tasks.parse_replay_task.delay(os.path.abspath(filename))
        task_ids.append(result.id)
    return jsonify(task_ids), 202


@bp.route('/upload', methods=['GET'])
def api_get_parse_status():
    ids = request.args.getlist("ids")
    states = [celery_tasks.get_task_state(id_).name for id_ in ids]
    return jsonify(states)


@bp.route('/upload/proto', methods=['POST'])
def api_upload_proto():
    print('Proto uploaded')

    # Convert to byte files from base64
    response = request.get_json()
    proto_in_memory = io.BytesIO(base64.b64decode(gzip.decompress(response['proto'])))
    pandas_in_memory = io.BytesIO(base64.b64decode(gzip.decompress(response['pandas'])))

    protobuf_game = ProtobufManager.read_proto_out_from_file(proto_in_memory)

    # Path creation
    filename = protobuf_game.game_metadata.match_guid
    if filename == '':
        filename = protobuf_game.game_metadata.id
    filename += '.replay'
    parsed_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data', 'parsed', filename)
    id_replay_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data', 'rlreplays',
                                  protobuf_game.game_metadata.id + '.replay')
    guid_replay_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data', 'rlreplays', filename)

    # Process
    session = current_app.config['db']()
    game, player_games, players, teamstats = convert_pickle_to_db(protobuf_game)
    add_objs_to_db(game, player_games, players, teamstats, session, preserve_upload_date=True)
    session.commit()
    session.close()

    # Write to disk
    proto_in_memory.seek(0)
    pandas_in_memory.seek(0)
    with open(parsed_path + '.pts', 'wb') as f:
        f.write(proto_in_memory.read())
    with open(parsed_path + '.gzip', 'wb') as f:
        f.write(pandas_in_memory.read())

    # Cleanup
    if os.path.isfile(id_replay_path):
        shutil.move(id_replay_path, guid_replay_path)

    return jsonify({'Success': True})

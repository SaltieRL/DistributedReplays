import base64
import gzip
import io
import logging
import os
import re
import shutil
import uuid

from carball.analysis.utils.proto_manager import ProtobufManager
from flask import jsonify, Blueprint, current_app, request, send_from_directory
from werkzeug.utils import secure_filename

from backend.blueprints.spa_api.service_layers.replay.basic_stats import PlayerStatsChart, TeamStatsChart
from backend.blueprints.steam import get_vanity_to_steam_id_or_random_response, steam_id_to_profile
from backend.database.objects import Game
from backend.database.utils.utils import add_objs_to_db, convert_pickle_to_db
from backend.database.wrapper.stats.player_stat_wrapper import TimeUnit
from backend.tasks import celery_tasks
from backend.tasks.utils import get_queue_length
from .errors.errors import CalculatedError, MissingQueryParams
from .query_params_handler import QueryParam, convert_to_datetime, get_query_params, convert_to_enum
from .service_layers.global_stats import GlobalStatsGraph
from .service_layers.logged_in_user import LoggedInUser
from .service_layers.player.play_style import PlayStyleResponse
from .service_layers.player.play_style_progression import PlayStyleProgression
from .service_layers.player.player import Player
from .service_layers.player.player_profile_stats import PlayerProfileStats
from .service_layers.player.player_ranks import PlayerRanks
from .service_layers.queue_status import QueueStatus
from .service_layers.replay.groups import ReplayGroupChartData
from .service_layers.replay.match_history import MatchHistory
from .service_layers.replay.replay import Replay
from .service_layers.replay.replay_positions import ReplayPositions

logger = logging.getLogger(__name__)

bp = Blueprint('api', __name__, url_prefix='/api/')


def better_jsonify(response: object):
    """
    Improvement on flask.jsonify (that depends on flask.jsonify) that calls the .__dict__ method on objects
    and also handles lists of such objects.
    :param response: The object/list of objects to be jsonified.
    :return: The return value of jsonify.
    """
    try:
        return jsonify(response)
    except TypeError:
        if isinstance(response, list):
            return jsonify([value.__dict__ for value in response])
        else:
            return jsonify(response.__dict__)


### GLOBAL

@bp.route('/global/replay_count')
def api_get_replay_count():
    s = current_app.config['db']()
    count = s.query(Game.hash).count()
    s.close()
    return jsonify(count)


@bp.route('/global/queue/count')
def api_get_queue_length():
    return better_jsonify(QueueStatus.create_for_queues())


@bp.route('/global/stats')
def api_get_global_stats():
    global_stats_graphs = GlobalStatsGraph.create()
    return better_jsonify(global_stats_graphs)


@bp.route('/me')
def api_get_current_user():
    return better_jsonify(LoggedInUser.create())


### PLAYER

@bp.route('player/<id_or_name>')
def api_get_player(id_or_name):
    if len(id_or_name) != 17 or re.match(re.compile('\d{17}'), id_or_name) is None:
        # Treat as name
        response = get_vanity_to_steam_id_or_random_response(id_or_name, current_app)
        if response is None:
            raise CalculatedError(404, "User not found")
        steam_id = response['response']['steamid']
        return jsonify(steam_id)
    else:
        # Treat as id
        result = steam_id_to_profile(id_or_name)
        if result is None:
            raise CalculatedError(404, "User not found")
        return jsonify(id_or_name)


@bp.route('player/<id_>/profile')
def api_get_player_profile(id_):
    player = Player.create_from_id(id_)
    return better_jsonify(player)


@bp.route('player/<id_>/profile_stats')
def api_get_player_profile_stats(id_):
    player_stats = PlayerProfileStats.create_from_id(id_)
    return better_jsonify(player_stats)


@bp.route('player/<id_>/ranks')
def api_get_player_ranks(id_):
    player_ranks = PlayerRanks.create_from_id(id_)
    return better_jsonify(player_ranks)


@bp.route('player/<id_>/play_style')
def api_get_player_play_style(id_):
    if 'rank' in request.args:
        rank = int(request.args['rank'])
    else:
        rank = None
    play_style_response = PlayStyleResponse.create_from_id(id_, raw='raw' in request.args, rank=rank)
    return better_jsonify(play_style_response)


@bp.route('player/<id_>/play_style/all')
def api_get_player_play_style_all(id_):
    accepted_query_params = [
        QueryParam(name='rank', optional=True, type_=int),
        QueryParam(name='replay_ids', optional=True)
    ]
    query_params = get_query_params(accepted_query_params, request)

    play_style_response = PlayStyleResponse.create_all_stats_from_id(id_, **query_params)
    return better_jsonify(play_style_response)


@bp.route('player/<id_>/play_style/progression')
def api_get_player_play_style_progress(id_):
    accepted_query_params = [
        QueryParam(name='time_unit', optional=True, type_=convert_to_enum(TimeUnit)),
        QueryParam(name='start_date', optional=True, type_=convert_to_datetime),
        QueryParam(name='end_date', optional=True, type_=convert_to_datetime),
    ]
    query_params = get_query_params(accepted_query_params, request)

    play_style_progression = PlayStyleProgression.create_progression(id_, **query_params)
    return better_jsonify(play_style_progression)


@bp.route('player/<id_>/match_history')
def api_get_player_match_history(id_):
    page = request.args.get('page')
    limit = request.args.get('limit')

    if page is None or limit is None:
        missing_params = []
        if page is None:
            missing_params.append('page')
        if limit is None:
            missing_params.append('limit')
        raise MissingQueryParams(missing_params)
    match_history = MatchHistory.create_from_id(id_, int(page), int(limit))
    return better_jsonify(match_history)


### REPLAY

@bp.route('replay/<id_>')
def api_get_replay_data(id_):
    replay = Replay.create_from_id(id_)
    return better_jsonify(replay)


@bp.route('replay/<id_>/basic_player_stats')
def api_get_replay_basic_player_stats(id_):
    basic_stats = PlayerStatsChart.create_from_id(id_)
    return better_jsonify(basic_stats)


@bp.route('replay/<id_>/basic_team_stats')
def api_get_replay_basic_team_stats(id_):
    basic_stats = TeamStatsChart.create_from_id(id_)
    return better_jsonify(basic_stats)


@bp.route('replay/<id_>/positions')
def api_get_replay_positions(id_):
    positions = ReplayPositions.create_from_id(id_)
    return better_jsonify(positions)


@bp.route('replay/group')
def api_get_replay_group():
    ids = request.args.getlist('ids')
    chart_data = ReplayGroupChartData.create_from_ids(ids)
    return better_jsonify(chart_data)


@bp.route('/replay/<id_>/download')
def download_replay(id_):
    return send_from_directory(current_app.config['REPLAY_DIR'], id_ + ".replay", as_attachment=True)


@bp.route('/replay')
def api_search_replays():
    accepted_query_params = [
        QueryParam(name='page', type_=int),
        QueryParam(name='limit', type_=int),
        QueryParam(name='player_ids', optional=True, is_list=True),
        QueryParam(name='playlists', optional=True, is_list=True, type_=int),
        QueryParam(name='rank', optional=True, type_=int),
        QueryParam(name='team_size', optional=True, type_=int),
        QueryParam(name='date_before', optional=True, type_=convert_to_datetime),
        QueryParam(name='date_after', optional=True, type_=convert_to_datetime),
        QueryParam(name='min_length', optional=True, type_=float),
        QueryParam(name='max_length', optional=True, type_=float),
        QueryParam(name='map', optional=True),
    ]
    query_params = get_query_params(accepted_query_params, request)
    match_history = MatchHistory.create_with_filters(**query_params)
    return better_jsonify(match_history)


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


@bp.errorhandler(CalculatedError)
def api_handle_error(error: CalculatedError):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

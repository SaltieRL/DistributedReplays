import logging
import os

from flask import jsonify, Blueprint, current_app, request, send_from_directory
from werkzeug.utils import secure_filename

from backend.blueprints.steam import get_vanity_to_steam_id_or_random_response
from backend.database.objects import Game
from backend.tasks import celery_tasks
from backend.tasks.utils import get_queue_length
from .errors.errors import CalculatedError, MissingQueryParams
from .service_layers.global_stats import GlobalStatsGraph
from .service_layers.logged_in_user import LoggedInUser
from .service_layers.player.play_style import PlayStyleResponse
from .service_layers.player.player import Player
from .service_layers.player.player_profile_stats import PlayerProfileStats
from .service_layers.player.player_ranks import PlayerRanks
from .service_layers.replay.basic_stats import BasicStatChartData
from .service_layers.replay.match_history import MatchHistory
from .service_layers.replay.replay import Replay

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
    steps = [0, 3, 6, 9]
    return jsonify({'priority ' + str(k): v for k, v in zip(steps, get_queue_length())})


@bp.route('/global/stats')
def api_get_global_stats():
    global_stats_graphs = GlobalStatsGraph.create()
    return better_jsonify(global_stats_graphs)


@bp.route('/steam/resolve/<id_>')
def api_resolve_steam(id_):
    response = get_vanity_to_steam_id_or_random_response(id_, current_app)
    if response is None:
        raise CalculatedError(404, "User not found")
    steam_id = response['response']['steamid']
    return jsonify(steam_id)


@bp.route('/me')
def api_get_current_user():
    return better_jsonify(LoggedInUser.create())


### PLAYER

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
    play_style_response = PlayStyleResponse.create_from_id(id_)
    return better_jsonify(play_style_response)


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


@bp.route('replay/<id_>/basic_stats')
def api_get_replay_basic_stats(id_):
    basic_stats = BasicStatChartData.create_from_id(id_)
    return better_jsonify(basic_stats)


@bp.route('/replay/<id_>/download')
def download_replay(id_):
    return send_from_directory(current_app.config['REPLAY_DIR'], id_ + ".replay", as_attachment=True)


@bp.route('/upload', methods=['POST'])
def api_upload_replays():
    uploaded_files = request.files.getlist("replays")
    logger.info(f"Uploaded files: {uploaded_files}")
    if uploaded_files is None or 'replays' not in request.files or len(uploaded_files) == 0:
        raise CalculatedError(400, 'No files uploaded')
    else:
        parse_status = []

    for file in uploaded_files:
        file.seek(0, os.SEEK_END)
        file_length = file.tell()
        if file_length > 5000000:
            continue
        if not file.filename.endswith('replay'):
            continue
        file.seek(0)
        filename = os.path.join(current_app.config['REPLAY_DIR'], secure_filename(file.filename))
        file.save(filename)
        result = celery_tasks.parse_replay_task.delay(os.path.abspath(filename))
        parse_status.append(
            { 'task_id': result.id,
            'filename': os.path.basename(filename)}
        )
    return better_jsonify(parse_status), 202

@bp.route('/status', methods=['POST'])
def api_get_parse_status():
    queued_tasks = request.getlist("task_id")
    if queued_tasks is None or 'task_id' not in request or len(queued_tasks) == 0:
        raise CalculatedError(400, 'No task ID provided')
    status = []
    
    for task in queued_tasks:
        state = celery_tasks.get_task_state(task)
        status.append(state)
    return better_jsonify(status)

@bp.errorhandler(CalculatedError)
def api_handle_error(error: CalculatedError):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

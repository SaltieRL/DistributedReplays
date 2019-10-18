import base64
import hashlib
import io
import json
import logging
import os
import re
import sys
import traceback
import uuid
import zlib

from carball.analysis.utils.proto_manager import ProtobufManager
from flask import jsonify, Blueprint, current_app, request, send_from_directory, Response
from werkzeug.utils import secure_filename, redirect

from backend.blueprints.spa_api.service_layers.admin import AdminPanelHandler
from backend.blueprints.spa_api.service_layers.homepage.patreon import PatreonProgress
from backend.blueprints.spa_api.service_layers.homepage.recent import RecentReplays
from backend.blueprints.spa_api.service_layers.homepage.twitch import TwitchStreams
from backend.blueprints.spa_api.service_layers.leaderboards import Leaderboards
from backend.blueprints.spa_api.service_layers.replay.heatmaps import ReplayHeatmaps
from backend.blueprints.spa_api.service_layers.replay.predicted_ranks import PredictedRank
from backend.blueprints.spa_api.service_layers.replay.visibility import ReplayVisibility
from backend.blueprints.spa_api.service_layers.replay.visualizations import Visualizations
from backend.blueprints.spa_api.utils.query_param_definitions import upload_file_query_params, \
    replay_search_query_params, progression_query_params, playstyle_query_params, visibility_params, convert_to_enum, \
    player_id, heatmap_query_params
from backend.database.startup import lazy_get_redis
from backend.database.wrapper.stats.item_stats_wrapper import ItemStatsWrapper
from backend.tasks.add_replay import create_replay_task, parsed_replay_processing
from backend.tasks.celery_tasks import auto_create_training_pack, create_manual_training_pack
from backend.utils.logger import ErrorLogger
from backend.blueprints.spa_api.service_layers.replay.visualizations import Visualizations
from backend.tasks.update import update_self
from backend.utils.file_manager import FileManager
from backend.utils.metrics import MetricsHandler
from backend.blueprints.spa_api.service_layers.replay.enums import HeatMapType
from backend.utils.rlgarage_handler import RLGarageAPI
from backend.utils.safe_flask_globals import get_current_user_id

try:
    import config
except ImportError:
    config = None

try:
    import config
    from google.cloud import storage

    REPLAY_BUCKET = config.REPLAY_BUCKET
    PROTO_BUCKET = config.PROTO_BUCKET
    FAILED_BUCKET = config.FAILED_BUCKET
    PARSED_BUCKET = config.PARSED_BUCKET
    TRAINING_PACK_BUCKET = config.TRAINING_PACK_BUCKET
except:
    print('Not uploading to buckets')
    REPLAY_BUCKET = ''
    PROTO_BUCKET = ''
    FAILED_BUCKET = ''
    PARSED_BUCKET = ''
    TRAINING_PACK_BUCKET = ''

from backend.blueprints.spa_api.service_layers.stat import get_explanations
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.blueprints.steam import get_vanity_to_steam_id_or_random_response, steam_id_to_profile
from backend.database.objects import Game, GameVisibilitySetting, TrainingPack, ReplayLog, ReplayResult
from backend.database.wrapper.chart.chart_data import convert_to_csv
from backend.tasks import celery_tasks
from backend.blueprints.spa_api.errors.errors import CalculatedError, NotYetImplemented, PlayerNotFound, \
    ReplayUploadError
from backend.blueprints.spa_api.service_layers.global_stats import GlobalStatsGraph, GlobalStatsChart
from backend.blueprints.spa_api.service_layers.logged_in_user import LoggedInUser
from backend.blueprints.spa_api.service_layers.player.play_style import PlayStyleResponse
from backend.blueprints.spa_api.service_layers.player.play_style_progression import PlayStyleProgression
from backend.blueprints.spa_api.service_layers.player.player import Player
from backend.blueprints.spa_api.service_layers.player.player_profile_stats import PlayerProfileStats
from backend.blueprints.spa_api.service_layers.player.player_ranks import PlayerRanks
from backend.blueprints.spa_api.service_layers.queue_status import QueueStatus
from backend.blueprints.spa_api.service_layers.replay.basic_stats import PlayerStatsChart, TeamStatsChart
from backend.blueprints.spa_api.service_layers.replay.groups import ReplayGroupChartData
from backend.blueprints.spa_api.service_layers.replay.match_history import MatchHistory
from backend.blueprints.spa_api.service_layers.replay.replay import Replay
from backend.blueprints.spa_api.service_layers.replay.replay_positions import ReplayPositions
from backend.blueprints.spa_api.service_layers.replay.tag import Tag
from backend.blueprints.spa_api.utils.decorators import require_user, with_query_params
from backend.blueprints.spa_api.utils.query_params_handler import QueryParam, get_query_params

try:
    from backend.tasks.training_packs.task import TrainingPackCreation
except (ModuleNotFoundError, ImportError):
    TrainingPackCreation = None
    print("Missing config or AES Key and CRC, not creating training packs")

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
        if hasattr(response, 'to_JSON'):
            return better_jsonify(response.to_JSON())
    except:
        pass

    try:
        return jsonify(response)
    except TypeError:
        if isinstance(response, list):
            return jsonify([value.__dict__ for value in response])
        else:
            return jsonify(response.__dict__)


def encode_bot_name(w):
    return 'b' + hashlib.md5(w.lower().encode()).hexdigest()[:9] + 'b'


### GLOBAL

@bp.route('/global/replay_count')
@with_session
def api_get_replay_count(session=None):
    count = session.query(Game.hash).count()
    return jsonify(count)


@bp.route('/global/queue/count')
def api_get_queue_length():
    return better_jsonify(QueueStatus.create_for_queues())


@bp.route('/global/stats')
def api_get_global_stats():
    global_stats_graphs = GlobalStatsGraph.create()
    return better_jsonify(global_stats_graphs)


@bp.route('/global/graphs')
def api_get_global_graphs():
    global_stats_charts = GlobalStatsChart.create()
    return better_jsonify(global_stats_charts)


@bp.route('/global/leaderboards')
def api_get_leaderboards():
    if lazy_get_redis() is not None:
        if lazy_get_redis().get("leaderboards"):
            resp = Response(response=lazy_get_redis().get("leaderboards"),
                            status=200,
                            mimetype="application/json")
            return resp
    leaderboards = Leaderboards.create()
    if lazy_get_redis() is not None:
        lazy_get_redis().set("leaderboards", json.dumps([l.__dict__ for l in leaderboards]), ex=24 * 60 * 60)
    return better_jsonify(leaderboards)


@bp.route('/me')
def api_get_current_user():
    return better_jsonify(LoggedInUser.create())


### PLAYER

@bp.route('player/<id_or_name>')
def api_get_player(id_or_name):
    if id_or_name.startswith("(bot)"):
        return jsonify(encode_bot_name(id_or_name[5:]))
    elif len(id_or_name) != 17 or re.match(re.compile('\d{17}'), id_or_name) is None:
        # Treat as name
        response = get_vanity_to_steam_id_or_random_response(id_or_name)
        if response is None:
            raise PlayerNotFound(404, "User not found")
        steam_id = response['response']['steamid']
        return jsonify(steam_id)
    else:
        # Treat as id
        result = steam_id_to_profile(id_or_name)
        if result is None:
            raise PlayerNotFound(404, "User not found")
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
    # TODO: Use get_query_params
    if 'rank' in request.args:
        rank = int(request.args['rank'])
    else:
        rank = None
    if 'playlist' in request.args:
        playlist = request.args['playlist']
    else:
        playlist = 13  # standard
    if 'result' in request.args:
        result = request.args['result']
        if result == 'win':
            win = True
        elif result == 'loss':
            win = False
    else:
        win = None
    play_style_response = PlayStyleResponse.create_from_id(id_, raw='raw' in request.args, rank=rank, playlist=playlist,
                                                           win=win)
    return better_jsonify(play_style_response)


@bp.route('player/<id_>/play_style/all')
@with_query_params(accepted_query_params=playstyle_query_params)
def api_get_player_play_style_all(id_, query_params=None):
    play_style_response = PlayStyleResponse.create_all_stats_from_id(id_, **query_params)
    return better_jsonify(play_style_response)


@bp.route('player/<id_>/play_style/progression')
@with_query_params(accepted_query_params=progression_query_params)
def api_get_player_play_style_progress(id_, query_params=None):
    play_style_progression = PlayStyleProgression.create_progression(id_, **query_params)
    return better_jsonify(play_style_progression)


@bp.route('player/<id_>/match_history')
@with_query_params(accepted_query_params=[QueryParam(name='page', type_=int, optional=False),
                                          QueryParam(name='limit', type_=int, optional=False)])
def api_get_player_match_history(id_, query_params=None):
    match_history = MatchHistory.create_from_id(id_, query_params['page'], query_params['limit'])
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


@bp.route('replay/<id_>/basic_player_stats/download')
def api_get_replay_basic_player_stats_download(id_):
    basic_stats = PlayerStatsChart.create_from_id(id_)
    return convert_to_csv(basic_stats, id_ + '.csv')


@bp.route('replay/<id_>/basic_team_stats')
def api_get_replay_basic_team_stats(id_):
    basic_stats = TeamStatsChart.create_from_id(id_)
    return better_jsonify(basic_stats)


@bp.route('replay/<id_>/basic_team_stats/download')
def api_get_replay_basic_team_stats_download(id_):
    basic_stats = TeamStatsChart.create_from_id(id_)
    return convert_to_csv(basic_stats, id_ + '.csv')


@bp.route('replay/<id_>/positions')
@with_query_params(accepted_query_params=[
    QueryParam(name='frame', type_=int, optional=True, is_list=True),
    QueryParam(name='frame_start', type_=int, optional=True),
    QueryParam(name='frame_count', type_=int, optional=True),
    QueryParam(name='as_proto', type_=bool, optional=True)
])
def api_get_replay_positions(id_, query_params=None):
    positions = ReplayPositions.create_from_id(id_, query_params=query_params)
    if query_params is None or 'as_proto' not in query_params:
        return better_jsonify(positions)
    raise NotYetImplemented()


@bp.route('replay/<id_>/heatmaps')
@with_query_params(accepted_query_params=heatmap_query_params)
def api_get_replay_heatmaps(id_, query_params=None):
    if query_params is not None and 'type' in query_params:
        type_ = query_params['type']
    else:
        type_ = HeatMapType.POSITIONING
    positions = ReplayHeatmaps.create_from_id(id_, type_=type_)
    return better_jsonify(positions)


@bp.route('replay/<id_>/boostmap')
def api_get_replay_boostmaps(id_):
    positions = Visualizations.create_from_id(id_)
    return jsonify(positions)


@bp.route('replay/group')
def api_get_replay_group():
    ids = request.args.getlist('ids')
    chart_data = ReplayGroupChartData.create_from_ids(ids)
    return better_jsonify(chart_data)


@bp.route('replay/group/download')
def api_download_group():
    ids = request.args.getlist('ids')
    chart_data = ReplayGroupChartData.create_from_ids(ids)
    return convert_to_csv(chart_data)


@bp.route('/replay/<id_>/download')
def download_replay(id_):
    filename = id_ + ".replay"
    path = FileManager.get_replay_path(id_)
    if os.path.isfile(path):
        return send_from_directory(current_app.config['REPLAY_DIR'], filename, as_attachment=True)
    elif config is not None and hasattr(config, 'GCP_BUCKET_URL'):
        return redirect(config.GCP_BUCKET_URL + filename)
    return "Replay not found", 404


@bp.route('replay/<id_>/predict')
def api_predict_ranks(id_):
    ranks = PredictedRank.create_from_id(id_)
    return better_jsonify(ranks)


@bp.route('/replay')
@with_query_params(accepted_query_params=replay_search_query_params)
def api_search_replays(query_params=None):
    match_history = MatchHistory.create_with_filters(**query_params)
    return better_jsonify(match_history)


@bp.route('replay/<id_>/visibility/<visibility>', methods=['PUT'])
@require_user
@with_query_params(accepted_query_params=visibility_params + player_id,
                   provided_params=['player_id', 'visibility'])
def api_update_replay_visibility(id_: str, visibility: str, query_params=None):
    try:
        visibility_setting = convert_to_enum(GameVisibilitySetting)(visibility)
    except Exception as e:
        try:
            visibility_setting = GameVisibilitySetting(int(visibility))
        except Exception as e:
            logger.error(e)
            return "Visibility setting not provided or incorrect", 400

    try:
        release_date = query_params['release_date']
    except KeyError:
        release_date = None

    replay_visibiltiy = ReplayVisibility.change_replay_visibility(game_hash=id_,
                                                                  visibility=visibility_setting,
                                                                  user_id=get_current_user_id(),
                                                                  release_date=release_date)
    return better_jsonify(replay_visibiltiy)


## Other

@bp.route('/stats/explanations')
def api_get_stat_explanations():
    return jsonify(get_explanations())


@bp.route('/upload', methods=['POST'])
@with_query_params(accepted_query_params=upload_file_query_params)
def api_upload_replays(query_params=None):
    uploaded_files = request.files.getlist("replays")
    logger.info(f"Uploaded files: {uploaded_files}")
    if uploaded_files is None or 'replays' not in request.files or len(uploaded_files) == 0:
        raise ReplayUploadError(400, 'No files uploaded')
    task_ids = []

    errors = []

    for file in uploaded_files:
        file.seek(0, os.SEEK_END)
        file_length = file.tell()
        if file_length > 5000000:
            errors.append(ReplayUploadError(413, 'Replay file is too big'))
            continue
        if not file.filename.endswith('replay'):
            errors.append(ReplayUploadError(415, 'Replay uploads must end in .replay'))
            continue
        file.seek(0)
        ud = uuid.uuid4()
        filename = os.path.join(current_app.config['REPLAY_DIR'], secure_filename(str(ud) + '.replay'))
        create_replay_task(file, filename, ud, task_ids, query_params)

    if len(errors) == 1:
        raise errors[0]

    return jsonify(task_ids), 202


@bp.route('/upload', methods=['GET'])
@with_query_params(accepted_query_params=[QueryParam(name="ids", is_list=True, type_=str, optional=True)])
def api_get_parse_status(query_params=None):
    ids = request.args.getlist("ids")
    states = [celery_tasks.get_task_state(id_).name for id_ in ids]
    return jsonify(states)


@bp.route('/upload/proto', methods=['POST'])
@with_query_params(accepted_query_params=upload_file_query_params)
def api_upload_proto(session=None, query_params=None):
    # Convert to byte files from base64
    payload = request.get_json()

    proto_in_memory = io.BytesIO(zlib.decompress(base64.b64decode(payload['proto'])))

    protobuf_game = ProtobufManager.read_proto_out_from_file(proto_in_memory)

    # Process
    try:
        parsed_replay_processing(protobuf_game, query_params=query_params)
    except Exception as e:
        payload['stack'] = traceback.format_exc()
        payload['error_type'] = type(e).__name__
        ErrorLogger.log_replay_error(payload, query_params, proto_game=protobuf_game)
        ErrorLogger.log_error(e, logger=logger)
        return jsonify({'Success': False})
    ErrorLogger.log_replay(payload, query_params, proto_game=protobuf_game)
    return jsonify({'Success': True})


@bp.route('/upload/proto/error', methods=['POST'])
@with_query_params(accepted_query_params=upload_file_query_params)
def api_upload_proto_error(query_params=None):
    payload = request.get_json()
    ErrorLogger.log_replay_error(payload, query_params)
    return jsonify({'Success': True})


### TAG

@bp.route('/tag/<name>', methods=["PUT"])
@require_user
@with_query_params(accepted_query_params=[
    QueryParam(name='private_id', type_=str, optional=True)
])
def api_create_tag(name: str, query_params=None):
    private_id = None
    if 'private_id' in query_params:
        private_id = query_params['private_id']
    tag = Tag.create(name, private_id=private_id)
    return better_jsonify(tag), 201


@bp.route('/tag/<current_name>', methods=["PATCH"])
@require_user
def api_rename_tag(current_name: str):
    accepted_query_params = [QueryParam(name='new_name')]
    query_params = get_query_params(accepted_query_params, request)

    tag = Tag.rename(current_name, query_params['new_name'])
    return better_jsonify(tag), 200


@bp.route('/tag/<name>', methods=['DELETE'])
@require_user
def api_delete_tag(name: str):
    Tag.delete(name)
    return '', 204


@bp.route('/tag')
@require_user
@with_query_params(accepted_query_params=[
    QueryParam(name='with_id', type_=bool, optional=True)
])
def api_get_tags(query_params=None):
    tags = Tag.get_all()
    with_id = False
    if 'with_id' in query_params:
        with_id = query_params['with_id']
    return better_jsonify([tag.to_JSON(with_id=with_id) for tag in tags])


@bp.route('/tag/<name>/private_key', methods=["GET"])
@require_user
def api_get_tag_key(name: str):
    return better_jsonify(Tag.get_encoded_private_key(name))


@bp.route('/tag/<name>/private_key/<private_id>', methods=["PUT"])
@require_user
def api_add_tag_key(name: str, private_id: str):
    Tag.add_private_key(name, private_id)
    return better_jsonify(private_id), 204


@bp.route('/tag/<name>/replay/<id_>', methods=["PUT"])
@require_user
def api_add_tag_to_game(name: str, id_: str):
    Tag.add_tag_to_game(name, id_)
    return '', 204


@bp.route('/tag/<name>/replay/<id_>', methods=["DELETE"])
@require_user
def api_remove_tag_from_game(name: str, id_: str):
    Tag.remove_tag_from_game(name, id_)
    return '', 204


@bp.route('/internal/update', methods=["GET"])
@require_user
@with_query_params([QueryParam(name='update_code', type_=int, optional=False)])
def update_server(query_params=None):
    code = query_params['update_code']
    update_self(code)
    return '', 200


@bp.errorhandler(CalculatedError)
def api_handle_error(error: CalculatedError):
    MetricsHandler.log_exception_for_metrics(error)
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@bp.route('/training/create')
@with_query_params(accepted_query_params=[
    QueryParam(name="date_start", type_=str, optional=True),
    QueryParam(name="date_end", type_=str, optional=True),
    QueryParam(name="player_id", type_=str, optional=True),
    QueryParam(name="replays", type_=str, optional=True, is_list=True),
    QueryParam(name="name", type_=str, optional=True)
])
def api_create_trainingpack(query_params=None):
    date_start = None
    date_end = None
    try:
        requester_id = get_current_user_id()
        pack_player_id = get_current_user_id()
    except:
        requester_id = None
        pack_player_id = None
    name = None
    replays = None
    if 'name' in query_params:
        name = query_params['name']
    if 'player_id' in query_params:
        pack_player_id = query_params['player_id']

    if 'replays' in query_params:
        replays = query_params['replays']
    if 'date_start' in query_params:
        date_start = query_params['date_start']
    if 'date_end' in query_params:
        date_end = query_params['date_end']
    task = auto_create_training_pack.delay(requester_id, pack_player_id, name, 10, date_start, date_end, replays)
    return better_jsonify({'status': 'Success', 'id': task.id})


@bp.route('/training/build', methods=['POST'])
def api_create_custom_trainingpack():
    _json = request.get_json(silent=True)
    if _json is None:
        raise CalculatedError(400, 'No JSON supplied.')

    requester_id = get_current_user_id()
    players = _json['players']
    replays = _json['replays']
    frames = [int(frame) for frame in _json['frames']]
    mode = False
    name = None
    if 'name' in _json:
        name = _json['name']
    if 'mode' in _json:
        mode = _json['mode'].lower() == 'goalie'
    task = create_manual_training_pack.delay(requester_id, players, replays, frames, name, mode)
    return better_jsonify({'status': 'Success', 'id': task.id})


@bp.route('/training/list')
@with_query_params(accepted_query_params=[
    QueryParam(name="player_id", type_=str, optional=True),
    QueryParam(name='page', type_=int, optional=False),
    QueryParam(name='limit', type_=int, optional=False)
])
@with_session
def api_find_trainingpack(query_params=None, session=None):
    player = get_current_user_id()
    if 'player_id' in query_params:
        player = query_params['player_id']
    elif player is None:
        raise CalculatedError(400, "Anonymous requests require 'player_id' parameter.")
    return better_jsonify(TrainingPackCreation.list_packs(player, query_params['page'], query_params['limit'], session))


@bp.route('/training/poll')
@with_query_params(accepted_query_params=[
    QueryParam(name="task_id", type_=str, optional=False)
])
@with_session
def api_poll_trainingpack(query_params=None, session=None):
    return better_jsonify(TrainingPackCreation.poll_pack(query_params['task_id'], session))


@bp.route('/training/import')
@require_user
@with_query_params(accepted_query_params=[
    QueryParam(name="guid", type_=str, optional=False)
])
@with_session
def api_import_trainingpack(query_params=None, session=None):
    if TrainingPackCreation.import_pack(query_params['guid'], session):
        return redirect('/training')
    return better_jsonify({
        'error': 'Error importing pack.'
    })


# Homepage

@bp.route('/home/twitch')
def get_twitch_streams():
    return better_jsonify(TwitchStreams.create())


@bp.route('/home/patreon')
def get_patreon_progress():
    return better_jsonify(PatreonProgress.create())


@bp.route('/home/recent')
def get_recent_replays():
    return better_jsonify(RecentReplays.create())


@bp.route('/documentation')
def get_endpoint_documentation():
    from backend.blueprints.spa_api.service_layers.documentation import create_documentation_for_module
    method_list = create_documentation_for_module(sys.modules[__name__])
    return better_jsonify(method_list)


# Items
@bp.route('/items/list')
@with_query_params(accepted_query_params=[
    QueryParam(name='category', type_=int, optional=True),
    QueryParam(name='page', type_=int, optional=False),
    QueryParam(name='limit', type_=int, optional=False)
])
def api_get_items_list(query_params=None):
    api = RLGarageAPI()
    if 'category' in query_params:
        result = ItemStatsWrapper.get_redis_result_if_exists("api_get_items_list_", query_params['category'])
        if result is not None:
            return jsonify(result)
        order = ItemStatsWrapper.create_unpainted_stats(query_params['category'], counts=True)
        result = api.get_item_list_by_category(query_params['category'], query_params['page'], query_params['limit'],
                                               order=[o['item_id'] for o in order])
        result['items'] = [{
            'count': order[i]['count'],
            **item
        } for i, item in enumerate(result['items'])]
        ItemStatsWrapper.set_redis_result_if_exists("api_get_items_list_", query_params['category'], ex=60 * 60 * 12)
        return better_jsonify(result)
    return better_jsonify(api.get_item_list(query_params['page'], query_params['limit']))


@bp.route('/items/info')
@with_query_params(accepted_query_params=[
    QueryParam(name='id', type_=int, optional=True)
])
def api_get_item(query_params=None):
    api = RLGarageAPI()
    return better_jsonify(api.get_item(query_params['id']))


@bp.route('/items/usage')
@with_query_params(accepted_query_params=[
    QueryParam(name='id', type_=int, optional=True)
])
def api_get_item_usage(query_params=None):
    return better_jsonify(ItemStatsWrapper.get_item_usage_over_time(query_params['id']))


@bp.route('/items/order')
@with_query_params(accepted_query_params=[
    QueryParam(name='category', type_=str, optional=True)
])
def api_get_item_order(query_params):
    stats = ItemStatsWrapper.create_unpainted_stats(counts=True)
    if query_params['category'] is not None:
        stats = stats[str(query_params['category'])]
    return better_jsonify(stats)


# ADMIN

@bp.route('/admin/group/add/<user_id>/<group>', methods=["GET"])
@require_user
def api_admin_add_group(user_id: str, group: str):
    try:
        group: int = int(group)
    except ValueError:
        raise CalculatedError(400, "Invalid group number format")
    return AdminPanelHandler.add_group_to_user(user_id, group)


@bp.route('/admin/group/remove/<user_id>/<group>', methods=["GET"])
@require_user
def api_admin_remove_group(user_id: str, group: str):
    try:
        group: int = int(group)
    except ValueError:
        raise CalculatedError(400, "Invalid group number format")
    return AdminPanelHandler.remove_group_from_user(user_id, group)


@bp.route('/admin/logs')
@require_user
@with_query_params(accepted_query_params=[QueryParam(name='page', type_=int, optional=False),
                                          QueryParam(name='limit', type_=int, optional=False),
                                          QueryParam(name='search', type_=str, optional=True)])
def api_admin_get_logs(query_params=None):
    search = None
    if 'search' in query_params and query_params['search'] != "":
        search = query_params['search']
    return jsonify(ErrorLogger.get_logs(query_params['page'], query_params['limit'], search))


@bp.route('/admin/failed/download')
@require_user
@with_query_params(accepted_query_params=[QueryParam(name='id', type_=str, optional=False)])
def api_admin_get_replay(query_params=None):
    return redirect(f"https://storage.googleapis.com/{FAILED_BUCKET}/{query_params['id']}.replay")

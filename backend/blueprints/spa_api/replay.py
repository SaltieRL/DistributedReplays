from flask import request, send_from_directory, current_app

from backend.database.wrapper.chart.chart_data import convert_to_csv
from .service_layers.replay.basic_stats import PlayerStatsChart, TeamStatsChart
from .service_layers.replay.groups import ReplayGroupChartData
from .service_layers.replay.match_history import MatchHistory
from .service_layers.replay.replay import Replay
from .service_layers.replay.replay_positions import ReplayPositions
from .spa_api import bp
from .utils.better_jsonify import better_jsonify
from .utils.query_params_handler import QueryParam, convert_to_datetime, get_query_params


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
    return convert_to_csv(basic_stats)


@bp.route('replay/<id_>/basic_team_stats')
def api_get_replay_basic_team_stats(id_):
    basic_stats = TeamStatsChart.create_from_id(id_)
    return better_jsonify(basic_stats)


@bp.route('replay/<id_>/basic_team_stats/download')
def api_get_replay_basic_team_stats_download(id_):
    basic_stats = TeamStatsChart.create_from_id(id_)
    return convert_to_csv(basic_stats)


@bp.route('replay/<id_>/positions')
def api_get_replay_positions(id_):
    positions = ReplayPositions.create_from_id(id_)
    return better_jsonify(positions)


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
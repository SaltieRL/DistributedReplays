from flask import jsonify, Blueprint, current_app

from backend.database.objects import Game
from .errors.errors import CalculatedError
from .service_layers.match_history import MatchHistory
from .service_layers.play_style import PlayStyleChartData
from .service_layers.player import Player
from .service_layers.player_profile_stats import PlayerProfileStats
from .service_layers.player_ranks import PlayerRanks
from .service_layers.replay import Replay

bp = Blueprint('api', __name__, url_prefix='/api/')


### GLOBAL

@bp.route('/global/replay_count')
def api_get_replay_count():
    s = current_app.config['db']()
    count = s.query(Game.hash).count()
    return jsonify(count)


### PLAYER

@bp.route('player/<id_>/profile')
def api_get_player_profile(id_):
    player = Player.create_from_id(id_)
    return jsonify(player.__dict__)


@bp.route('player/<id_>/profile_stats')
def api_get_player_profile_stats(id_):
    player_stats = PlayerProfileStats.create_from_id(id_)
    return jsonify(player_stats.__dict__)


@bp.route('player/<id_>/ranks')
def api_get_player_ranks(id_):
    player_ranks = PlayerRanks.create_from_id(id_)
    return jsonify(player_ranks.__dict__)


@bp.route('player/<id_>/play_style')
def api_get_player_play_style(id_):
    play_style_chart_datas = PlayStyleChartData.create_from_id(id_)
    return jsonify([play_style_chart_data.__dict__
                    for play_style_chart_data in play_style_chart_datas])


@bp.route('player/<id_>/match_history')
def api_get_player_match_history(id_):
    match_history = MatchHistory.create_from_id(id_)
    return jsonify(match_history.replays)


### REPLAY

@bp.route('replay/<id_>')
def api_get_replay_data(id_):
    replay = Replay.create_from_id(id_)
    if replay is None:
        error = jsonify({"message": "Replay not found."})
        error.status_code = 404
        return error
    return jsonify(replay.__dict__)


@bp.errorhandler(CalculatedError)
def api_handle_error(error: CalculatedError):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

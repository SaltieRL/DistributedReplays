from flask import jsonify, Blueprint, current_app

from .service_layers.player import Player
from .service_layers.player_ranks import PlayerRanks
from .service_layers.player_stats import PlayerStats
from ...database.objects import Game

bp = Blueprint('api', __name__, url_prefix='/api/')


@bp.route('/global/replay_count')
def api_get_replay_count():
    s = current_app.config['db']()
    count = s.query(Game.hash).count()
    return jsonify(count)


@bp.route('player/<id_>/profile')
def api_get_player_profile(id_):
    player = Player.create_from_id(id_)
    return jsonify(player.__dict__)


@bp.route('player/<id_>/profile_stats')
def api_get_player_profile_stats(id_):
    player_stats = PlayerStats.create_from_id(id_)
    return jsonify(player_stats.__dict__)


@bp.route('player/<id_>/ranks')
def api_get_player_ranks(id_):
    player_ranks = PlayerRanks.create_from_id(id_)
    return jsonify(player_ranks.__dict__)

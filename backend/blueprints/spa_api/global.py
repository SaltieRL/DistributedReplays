from flask import current_app, jsonify

from backend.database.objects import Game
from .service_layers.global_stats import GlobalStatsGraph
from .service_layers.logged_in_user import LoggedInUser
from .service_layers.queue_status import QueueStatus
from .spa_api import bp
from .utils.better_jsonify import better_jsonify


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
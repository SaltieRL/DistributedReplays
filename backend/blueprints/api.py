import datetime
import os
from functools import wraps

from carball.analysis.utils import proto_manager
from flask import render_template, url_for, redirect, request, jsonify, send_from_directory, Blueprint, current_app, \
    Response
from google.protobuf.json_format import MessageToJson
from sqlalchemy import func
from sqlalchemy.sql import operators

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Game, PlayerGame
from backend.database.wrapper.query_filter_builder import QueryFilterBuilder
from backend.utils.psyonix_api_handler import get_rank, tier_div_to_string

bp = Blueprint('apiv1', __name__, url_prefix='/api/v1')


def key_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'key' not in request.args:
            return jsonify({'error': 'Invalid API key supplied.'})
            # return redirect(url_for('api', next=request.url))
        return f(*args, **kwargs)

    return decorated_function


@bp.route('/api')
def api():
    return render_template('api.html')


@bp.route('/')
def api_v1():
    return redirect(url_for('api'))


@bp.route('/replays')
@key_required
@with_session
def api_v1_get_replays(session=None):
    if 'key' in request.args:
        api_key = request.args['key']
    else:
        api_key = None
    args = request.args
    print(args)
    if 'page' not in args:
        page = 0
    else:
        page = int(args['page']) - 1
    if page < 0:
        page = 0
    games = session.query(Game)
    # RANK STUFF
    if 'rankany' in args:
        rank_opt = 'any'
    else:
        rank_opt = 'all'
    if 'maxrank' in args:
        games = games.filter(getattr(Game.ranks, rank_opt)(int(args['maxrank']), operator=operators.ge))
    if 'minrank' in args:
        games = games.filter(getattr(Game.ranks, rank_opt)(int(args['minrank']), operator=operators.le))

    any_rank_modifier = ['minrank', 'maxrank']
    if any([m in args for m in any_rank_modifier]):
        games = games.filter(func.array_length(Game.ranks, 1) > 0)
    # MMR stuff
    if 'mmrany' in args:
        mmr_opt = 'any'
    else:
        mmr_opt = 'all'
    if 'maxmmr' in args:
        games = games.filter(getattr(Game.mmrs, mmr_opt)(int(args['maxmmr']), operator=operators.ge))
    if 'minmmr' in args:
        games = games.filter(getattr(Game.mmrs, mmr_opt)(int(args['minmmr']), operator=operators.le))

    any_mmr_modifier = ['maxmmr', 'minmmr']
    if any([m in args for m in any_mmr_modifier]):
        games = games.filter(func.array_length(Game.mmrs, 1) > 0)
    # USER stuff
    if 'user' in args:
        games = games.filter(Game.players.any(args['user']))

    # YEAR stuff
    if 'year' in args:
        games = games.filter(Game.match_date > datetime.date(int(args['year']), 1, 1)).filter(
            Game.match_date < datetime.date(int(args['year']) + 1, 1, 1))

    # GAME stuff
    if 'map' in args:
        games = games.filter(Game.map == args['map'])
    if 'teamsize' in args:
        games = games.filter(Game.teamsize == int(args['teamsize']))
    if 'playlist' in args:
        games = games.filter(Game.playlist == int(args['playlist']))
    pagesize = 50
    if 'num' in args:
        pagesize = int(args['num'])
        if pagesize > 200:
            pagesize = 200
    response = {}
    data = []
    games = games[page * pagesize:(page + 1) * pagesize]
    game: Game
    for game in games:
        data.append(
            {
                'team_blue_score': game.team0score,
                'team_orange_score': game.team1score,
                'match_date': game.match_date,
                'upload_date': game.upload_date,
                'map': game.map,
                'matchtype': game.matchtype,
                'teamsize': game.teamsize,
                'hash': game.hash,
                'link': '/replays/' + game.hash,
                'download': '/api/replay/' + game.hash + '/download',
                'info': url_for('apiv1.api_v1_get_replay_info', id_=game.hash, key=api_key),
                'mmrs': game.mmrs,
                'ranks': game.ranks,
                'players': game.players})
    response['data'] = data
    response['page'] = page + 1
    response['next'] = url_for('apiv1.api_v1_get_replays', page=page + 2, key=api_key)
    response['version'] = 1
    return jsonify(response)


@bp.route('/ranks')
@key_required
def api_v1_get_ranks():
    data = {i: tier_div_to_string(i) for i in range(0, 20)}
    return jsonify(data)


@bp.route('/stats')
@key_required
@with_session
def api_v1_get_stats(session=None):
    # TODO: stats?
    ct = session.query(Game).count()
    dct = len([f for f in os.listdir(current_app.config['PARSED_DIR']) if f.endswith('pts')])
    return jsonify({'db_count': ct, 'count': dct})


@bp.route('/replay/<id_>')
@key_required
def api_v1_get_replay_info(id_):
    pickle_path = os.path.join(current_app.config['PARSED_DIR'], id_ + '.replay.pts')
    replay_path = os.path.join(current_app.config['REPLAY_DIR'], id_ + '.replay')
    try:
        with open(pickle_path, 'rb') as f:
            g = proto_manager.ProtobufManager.read_proto_out_from_file(f)
        response = Response(
            response=convert_proto_to_json(g),
            status=200,
            mimetype='application/json'
        )

        return response

    except Exception as e:
        return jsonify({'error': 'Error opening game: ' + str(e)})
    game = session.query(Game).filter(Game.hash == id_).first()
    data = {'datetime': g.datetime, 'map': g.map, 'mmrs': game.mmrs, 'ranks': game.ranks, 'name': g.name,
            'hash': game.hash, 'version': g.replay_version, 'id': g.id, 'frames': len(g.frames)}
    data = player_interface(data, g, game.mmrs, game.ranks)
    data = team_interface(data, g)
    data = score_interface(data, g)
    data = goals_interface(data, g)
    return jsonify(data)


@bp.route('/parsed/list')
@key_required
def api_v1_list_parsed_replays():
    fs = os.listdir(current_app.config['PARSED_DIR'])
    return jsonify(fs)


@bp.route('/parsed/<path:fn>')
@key_required
def api_v1_download_parsed(fn):
    return send_from_directory(current_app.config['PARSED_DIR'], fn, as_attachment=True)


@bp.route('/rank/<id_>')
@key_required
def api_v1_get_rank(id_):
    return jsonify(get_rank(id_))


@bp.route('/playergames')
@key_required
@with_session
def api_v1_get_playergames_by_rank(session=None):
    if 'days' in request.args:
        days = int(request.args['days'])
    else:
        days = 3 * 30
    builder = QueryFilterBuilder().with_stat_query([PlayerGame]).with_relative_start_time(days)
    QueryFilterBuilder.apply_arguments_to_query(builder, request.args)
    games = builder.build_query(session).order_by(func.random())[:1000]
    columns = [c.name for c in games[0].__table__.columns]
    data = {
        'data': [[getattr(g, c.name) for c in g.__table__.columns] for g in games],
        'columns': columns
    }
    return jsonify(data)


def convert_proto_to_json(proto):
    return MessageToJson(proto)

import os
import pickle
from functools import wraps

from flask import render_template, url_for, redirect, request, jsonify, send_from_directory, Blueprint, current_app, \
    Response
from sqlalchemy import func
from sqlalchemy.sql import operators

from api_return_classes.ApiGame import ApiGame
from players import get_rank, tier_div_to_string
from objects import Game
from replayanalysis.analysis.saltie_game.saltie_game import SaltieGame as ReplayGame
from replayanalysis.json_parser.player import Player
from replayanalysis.json_parser.team import Team

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
def api_v1_get_replays():
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
    session = current_app.config['db']()
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
    response = {}
    data = []
    games = games[page * 50:(page + 1) * 50]
    for game in games:
        data.append({'hash': game.hash, 'link': url_for('replays.view_replay', id_=game.hash),
                     'download': url_for('replays.download_replay', id_=game.hash),
                     'info': url_for('apiv1.api_v1_get_replay_info', id_=game.hash, key=api_key),
                     'mmrs': game.mmrs, 'ranks': game.ranks, 'players': game.players})
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
def api_v1_get_stats():
    # TODO: stats?
    session = current_app.config['db']()
    ct = session.query(Game).count()
    dct = len([f for f in os.listdir('parsed') if f.endswith('pkl')])
    return jsonify({'db_count': ct, 'count': dct})


@bp.route('/replay/<id_>')
@key_required
def api_v1_get_replay_info(id_):
    session = current_app.config['db']()
    pickle_path = os.path.join('parsed', id_ + '.replay.pkl')
    replay_path = os.path.join('rlreplays', id_ + '.replay')
    if os.path.isfile(replay_path) and not os.path.isfile(pickle_path):
        return render_template('replay.html', replay=None)
    try:
        g = pickle.load(open(os.path.join('parsed', id_ + '.replay.pkl'), 'rb'), encoding='latin1')  # type: ReplayGame
        response = Response(
            response=g.api_game.to_json(),
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
    fs = os.listdir('parsed/')
    return jsonify(fs)


@bp.route('/parsed/<path:fn>')
@key_required
def api_v1_download_parsed(fn):
    return send_from_directory('parsed', fn, as_attachment=True)


@bp.route('/rank/<id_>')
@key_required
def api_v1_get_rank(id_):
    return jsonify(get_rank(id_))


def player_interface(data, g, mmrs, ranks):
    data['players'] = []
    for p, mmr, rank in zip(g.players, mmrs, ranks):  # type: Player
        d = {'camera_settings': p.camera_settings, 'name': p.name, 'online_id': p.online_id, 'score': p.score,
             'saves': p.saves, 'shots': p.shots, 'goals': p.goals, 'title': p.title, 'team_is_orange': p.team.is_orange,
             'loadout': p.loadout, 'mmr': mmr, 'rank': rank}
        data['players'].append(d)
    return data


def team_interface(data, game: ReplayGame):
    data['teams'] = []
    for t in game.teams:  # type: Team
        d = {'name': t.name, 'players': [p.name for p in t.players], 'score': t.score, 'is_orange': t.is_orange}
        data['teams'].append(d)
    return data


def score_interface(data, game: ReplayGame):
    data['score'] = {'team0score': game.teams[0].score, 'team1score': game.teams[1].score}
    return data


def goals_interface(data, game: ReplayGame):
    data['goals'] = []
    for goal in game.goals:
        data['goals'].append({'frame': goal.frame_number, 'player': goal.player_name})
    return data

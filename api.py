import os
import pickle
from functools import wraps
from typing import Optional, Any

from flask import render_template, url_for, redirect, request, g, jsonify, send_from_directory
from sqlalchemy.sql import operators

from RLBotServer import app, Session
from functions import tier_div_to_string, get_rank
from objects import Game
import pandas as pd

from replayanalysis.game.player import Player
from replayanalysis.game.team import Team
from replayanalysis.game.game import Game as ReplayGame


def key_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'key' not in request.args:
            return jsonify({'error': 'Invalid API key supplied.'})
            # return redirect(url_for('api', next=request.url))
        return f(*args, **kwargs)

    return decorated_function


@app.route('/api')
def api():
    return render_template('api.html')


@app.route('/api/v1')
def api_v1():
    return redirect(url_for('api'))


@app.route('/api/v1/replays')
@key_required
def api_v1_get_replays():
    args = request.args
    print(args)
    if 'page' not in args:
        page = 0
    else:
        page = int(args['page']) - 1
    if page < 0:
        page = 0
    session = Session()
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

    # MMR stuff
    if 'mmrany' in args:
        mmr_opt = 'any'
    else:
        mmr_opt = 'all'
    if 'maxmmr' in args:
        games = games.filter(getattr(Game.mmrs, mmr_opt)(int(args['maxmmr']), operator=operators.ge))
    if 'minmmr' in args:
        games = games.filter(getattr(Game.mmrs, mmr_opt)(int(args['minmmr']), operator=operators.le))

    # USER stuff
    if 'user' in args:
        games = games.filter(Game.players.any(args['user']))
    response = {}
    data = []
    games = games[page * 50:(page + 1) * 50]
    for game in games:
        data.append({'hash': game.hash, 'link': url_for('view_replay', id_=game.hash),
                     'download': url_for('download_replay', id_=game.hash),
                     'info': url_for('api_v1_get_replay_info', id_=game.hash),
                     'mmrs': game.mmrs, 'ranks': game.ranks, 'players': game.players})
    response['data'] = data
    response['page'] = page + 1
    response['next'] = url_for('api_v1_get_replays', page=page + 2)
    response['version'] = 1
    return jsonify(response)


@app.route('/api/v1/ranks')
@key_required
def api_v1_get_ranks():
    data = {i: tier_div_to_string(i) for i in range(0, 20)}
    return jsonify(data)


@app.route('/api/v1/stats')
@key_required
def api_v1_get_stats():
    # TODO: stats?
    session = Session()
    ct = session.query(Game).count()
    dct = len([f for f in os.listdir('parsed') if f.endswith('pkl')])
    return jsonify({'db_count': ct, 'count': dct})


@app.route('/api/v1/replay/<id_>')
@key_required
def api_v1_get_replay_info(id_):
    session = Session()
    pickle_path = os.path.join('parsed', id_ + '.replay.pkl')
    replay_path = os.path.join('rlreplays', id_ + '.replay')
    if os.path.isfile(replay_path) and not os.path.isfile(pickle_path):
        return render_template('replay.html', replay=None)
    try:
        g = pickle.load(open(os.path.join('parsed', id_ + '.replay.pkl'), 'rb'), encoding='latin1')  # type: ReplayGame
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


@app.route('/api/v1/parsed/list')
@key_required
def api_v1_list_parsed_replays():
    fs = os.listdir('parsed/')
    return jsonify(fs)


@app.route('/api/v1/parsed/<path:fn>')
@key_required
def api_v1_download_parsed(fn):
    return send_from_directory('parsed', fn, as_attachment=True)


@app.route('/api/v1/rank/<id_>')
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

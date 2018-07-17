from functools import wraps

from flask import render_template, url_for, redirect, request, g, jsonify
from sqlalchemy.sql import operators

from RLBotServer import app, Session
from functions import tier_div_to_string
from objects import Game


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
    response = {}
    data = []
    games = games[page * 50:(page + 1) * 50]
    for game in games:
        data.append({'hash': game.hash, 'link': url_for('view_replay', id_=game.hash),
                     'download': url_for('download_replay', id_=game.hash),
                     'mmrs': game.mmrs, 'ranks': game.ranks})
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

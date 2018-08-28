import ast
import gzip
import json
import os
import pandas as pd
import pickle
import random

import numpy as np
import redis
from flask import request, redirect, send_from_directory, render_template, url_for, Blueprint, current_app, jsonify
from sqlalchemy import func, desc, Float, cast, Numeric
from werkzeug.utils import secure_filename

from data import constants
from database import queries
from database.objects import PlayerGame, Game
from helpers.functions import return_error, get_item_dict, render_with_session, get_rank_batch
from replayanalysis.replay_analysis.analysis.utils import proto_manager, pandas_manager
from replayanalysis.replay_analysis.analysis.utils.numpy_manager import read_array_from_file
from tasks import celery_tasks

bp = Blueprint('replays', __name__, url_prefix='/replays')
#
#
# @app.route('/replay/reward/<uid>')
# def get_reward_from_replay(uid):
#     calculate_reward.delay(uid)
#     return redirect('/')

print('Loaded replay app')


@bp.route('/upload', methods=['GET'])
def replays_home():
    session = current_app.config['db']()
    replay_count = queries.get_replay_count(session)
    replay_data = queries.get_replay_stats(session)
    model_data = queries.get_model_stats(session)
    return render_with_session('upload.html', session, stats=replay_data, total=replay_count, model_stats=model_data)


@bp.route('/parse', methods=['POST'])
def parse_replay():
    if 'file' not in request.files:
        return return_error('No file part')
    file = request.files['file']
    if not file.filename.endswith('replay'):
        return return_error('Only .replay files are allowed.')
    filename = os.path.join(current_app.config['REPLAY_DIR'], secure_filename(file.filename))
    file.save(filename)
    celery_tasks.parse_replay_task.delay(os.path.abspath(filename))
    return redirect(url_for('replays.view_replay', id_=file.filename.split('.')[0]))


@bp.route('/parse/all')
def parse_replays():
    for f in os.listdir(current_app.config['REPLAY_DIR']):
        pickled = os.path.join(current_app.config['PARSED_DIR'], os.path.basename(f) + '.pts')
        if f.endswith('.replay') and not os.path.isfile(pickled):
            result = celery_tasks.parse_replay_task.delay(
                os.path.abspath(os.path.join(current_app.config['REPLAY_DIR'], f)))
    return redirect('/')


@bp.route('/parsed/view/<id_>')
def view_replay(id_):
    session = current_app.config['db']()
    game = session.query(Game).filter(Game.hash == id_).first()
    if game is None:
        return redirect('/')
    players = game.players
    # pickle_path = os.path.join(current_app.config['PARSED_DIR'], id_ + '.replay.pkl')
    # replay_path = os.path.join(current_app.config['REPLAY_DIR'], id_ + '.replay')
    # if os.path.isfile(replay_path) and not os.path.isfile(pickle_path):
    #     return render_template('replay.html', replay=None, id=id_)
    # try:
    #     g = pickle.load(open(pickle_path, 'rb'), encoding='latin1')  # type: Game_pickle
    # except Exception as e:
    #     return return_error('Error opening game: ' + str(e))
    # players = g.api_game.teams[0].players + g.api_game.teams[1].players
    # for p in players:
    #     if isinstance(p.id, list):  # some players have array platform-ids
    #         p.id = p.id
    #         print('array online_id', p.id)
    ranks = get_rank_batch(players)
    return render_with_session('replay.html', session, replay=game, cars=constants.cars, id=id_, ranks=ranks,
                               item_dict=get_item_dict())


@bp.route('/parsed/view/<id_>/positions')
def view_replay_data(id_):
    pickle_path = os.path.join(current_app.config['PARSED_DIR'], id_ + '.replay.pts')
    gzip_path = os.path.join(current_app.config['PARSED_DIR'], id_ + '.replay.gzip')
    replay_path = os.path.join(current_app.config['REPLAY_DIR'], id_ + '.replay')
    if os.path.isfile(replay_path) and not os.path.isfile(pickle_path):
        return jsonify("Error no replay exists for this user")

    def process_tuple_str(s):
        return ast.literal_eval(s)

    try:
        with gzip.open(gzip_path, 'rb') as f:
            df = pandas_manager.PandasManager.safe_read_pandas_to_memory(f).set_index('index')
            df.columns = pd.MultiIndex.from_tuples([process_tuple_str(s) for s in df.columns])
            print(df.columns)
        with open(pickle_path, 'rb') as f:
            g = proto_manager.ProtobufManager.read_proto_out_from_file(f)
    except Exception as e:
        return return_error('Error opening game: ' + str(e))
    field_ratio = 5140.0 / 4120
    x_mult = 100.0 / 4120
    y_mult = 100.0 / 5140 * field_ratio
    z_mult = 100.0 / 2000
    cs = ['pos_x', 'pos_y', 'pos_z']
    rot_cs = ['rot_x', 'rot_y', 'rot_z']
    ball = df['ball']
    # ball['pos_x'] = ball['pos_x'] * x_mult
    # ball['pos_y'] = ball['pos_y'] * y_mult
    # ball['pos_z'] = ball['pos_z'] * z_mult
    ball_df = ball[cs]
    players = g.players
    names = [p.name for p in players]

    def process_player_df(game):
        d = []
        for p in names:
            df[p][rot_cs] = df[p][rot_cs] / 65536.0 * 2 * 3.14159265
            df[p]['pos_x'] = df[p]['pos_x'] * x_mult
            df[p]['pos_y'] = df[p]['pos_y'] * y_mult
            df[p]['pos_z'] = df[p]['pos_z'] * z_mult
            d.append(df[p][cs + rot_cs + ['boost_active']].fillna(-100).values.tolist())
        return d

    players_data = process_player_df(g)
    frame_data = df['game'][['delta', 'seconds_remaining', 'time']]
    # goal_data = [[gl.frame_number, gl.player_team] for gl in g.goals]
    data = {
        'ball': ball_df.fillna(-100).values.tolist(),
        'players': players_data,
        'colors': [p.is_orange for p in players],
        'names': [p.name for p in players],
        'frames': frame_data.fillna(-100).values.tolist(),
        # 'goals': goal_data
    }
    return jsonify(data)


@bp.route('/parsed/view/random')
def view_random():
    filelist = os.listdir(current_app.config['PARSED_DIR'])
    return redirect(url_for('replays.view_replay', id_=random.choice(filelist).split('.')[0]))


@bp.route('/download/replay/<id_>')
def download_replay(id_):
    return send_from_directory(current_app.config['REPLAY_DIR'], id_)


@bp.route('/autoreplays')
def downloader_page():
    return render_template('saltie.html')


# STATS STUFF

@bp.route('/stats')
def replay_stats():
    return render_template('replay-stats.html')


# @bp.route('/stats/score')
# def score_distribution():
#     session = current_app.config['db']()
#     data = session.query(PlayerGame.score, func.count(PlayerGame.id)).group_by(PlayerGame.score).order_by(
#         PlayerGame.score).all()
#     return jsonify({k: v for k, v in data})


@bp.route('/stats/score/numpy')
def score_distribution_np():
    session = current_app.config['db']()
    data = np.array(session.query(PlayerGame.score).filter(
        PlayerGame.score % 10 == 0).filter(PlayerGame.score > 0).all())
    non_log = np.histogram(data, bins=30)
    log = np.histogram(np.log(data), bins=30)
    session.close()
    return jsonify({'log': {'data': log[0].tolist(), 'bins': log[1].tolist()},
                    'non_log': {'data': non_log[0].tolist(), 'bins': non_log[1].tolist()}})


stats = ['score', 'goals', 'assists', 'saves', 'shots', 'a_hits', 'turnovers', 'total_passes', 'total_dribbles',
         'assistsph',
         'savesph', 'shotsph', 'turnoversph', 'total_dribblesph']


@bp.route('/stats/<id_>')
def goal_distribution(id_):
    if id_ in stats:
        gamemodes = range(1, 5)
        session = current_app.config['db']()
        q = session.query(getattr(PlayerGame, id_), func.count(PlayerGame.id)).group_by(
            getattr(PlayerGame, id_)).order_by(getattr(PlayerGame, id_))
        if id_ == 'score':
            q = q.filter(PlayerGame.score % 10 == 0)
        data = {}
        for g in gamemodes:
            # print(g)
            d = q.join(Game).filter(Game.teamsize == g).all()
            data[g] = {k: v for k, v in d if k is not None}
        return jsonify(data)
    else:
        return jsonify({})


@bp.route('/stats/all')
def distribution():
    session = current_app.config['db']()
    try:
        r = current_app.config['r']
    except KeyError:
        r = None
    if r is not None:
        try:
            cache = r.get('stats_cache')
            if cache is not None:
                return jsonify(json.loads(cache))
        except redis.exceptions.ConnectionError as e:
            print('Issue connecting to cache')
    overall_data = {}
    numbers = []
    for n in range(4):
        numbers.append(session.query(func.count(PlayerGame.id)).join(Game).filter(Game.teamsize == (n + 1)).first()[0])
    print(numbers)
    for id_ in stats:
        gamemodes = range(1, 5)
        print(id_)
        if id_.endswith('ph'):
            q = session.query(
                func.round(cast(getattr(PlayerGame, id_.replace('ph', '')), Numeric) / PlayerGame.total_hits, 2).label(
                    'n'),
                func.count(PlayerGame.id)).filter(PlayerGame.total_hits > 0).group_by('n').order_by('n')
        else:
            q = session.query(getattr(PlayerGame, id_), func.count(PlayerGame.id)).group_by(
                getattr(PlayerGame, id_)).order_by(getattr(PlayerGame, id_))
        if id_ == 'score':
            q = q.filter(PlayerGame.score % 10 == 0)
        data = {}
        for g in gamemodes:
            # print(g)
            d = q.join(Game).filter(Game.teamsize == g).all()
            data[g] = {
                'keys': [],
                'values': []
            }
            for k, v in d:
                if k is not None:
                    data[g]['keys'].append(float(k))
                    data[g]['values'].append(float(v) / float(numbers[g - 1]))
        overall_data[id_] = data

    if r is not None:
        try:
            r.set('stats_cache', json.dumps(overall_data), ex=60 * 60)
        except redis.exceptions.ConnectionError as e:
            print('connection error')

    session.close()
    return jsonify(overall_data)


@bp.route('/stats/cars')
def car_distribution():
    session = current_app.config['db']()
    data = session.query(PlayerGame.car, func.count(PlayerGame.id).label('count')).group_by(PlayerGame.car).order_by(
        desc('count')).all()
    car_data = []
    for entry in data:
        car, val = entry
        if int(car) in constants.cars:
            car_data.append([constants.cars[int(car)], val])

    session.close()
    return jsonify(car_data)

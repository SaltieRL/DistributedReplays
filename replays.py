import os
import pickle
import random

from flask import request, redirect, send_from_directory, render_template, url_for, Blueprint, current_app, jsonify
from sqlalchemy import func, desc
from werkzeug.utils import secure_filename

import celery_tasks
import constants
from functions import return_error, get_item_dict
from objects import PlayerGame
from players import get_rank
import queries
from replayanalysis.game.game import Game as Game_pickle

bp = Blueprint('replays', __name__, url_prefix='/replays')
#
#
# @app.route('/replay/reward/<uid>')
# def get_reward_from_replay(uid):
#     calculate_reward.delay(uid)
#     return redirect('/')

print('Loaded replay app')


@bp.route('/', methods=['GET'])
def replays_home():
    session = current_app.config['db']()
    replay_count = queries.get_replay_count(session)
    replay_data = queries.get_replay_stats(session)
    model_data = queries.get_model_stats(session)
    return render_template('upload.html', stats=replay_data, total=replay_count, model_stats=model_data)


@bp.route('/parse', methods=['POST'])
def parse_replay():
    if 'file' not in request.files:
        return return_error('No file part')
    file = request.files['file']
    if not file.filename.endswith('replay'):
        return return_error('Only .replay files are allowed.')
    filename = os.path.join('rlreplays', secure_filename(file.filename))
    file.save(filename)
    celery_tasks.parse_replay_task.delay(os.path.abspath(filename))
    return redirect(url_for('replays.view_replay', id_=file.filename.split('.')[0]))


@bp.route('/parse/all')
def parse_replays():
    for f in os.listdir('rlreplays'):
        pickled = os.path.join(os.path.dirname(__file__), 'parsed', os.path.basename(f) + '.pkl')
        if f.endswith('.replay') and not os.path.isfile(pickled):
            result = celery_tasks.parse_replay_task.delay(os.path.abspath(os.path.join('rlreplays', f)))
    return redirect('/')


@bp.route('/parsed/view/<id_>')
def view_replay(id_):
    pickle_path = os.path.join('parsed', id_ + '.replay.pkl')
    replay_path = os.path.join('rlreplays', id_ + '.replay')
    if os.path.isfile(replay_path) and not os.path.isfile(pickle_path):
        return render_template('replay.html', replay=None, id=id_)
    try:
        g = pickle.load(open(os.path.join('parsed', id_ + '.replay.pkl'), 'rb'), encoding='latin1')  # type: Game_pickle
    except Exception as e:
        return return_error('Error opening game: ' + str(e))
    # ranks = [{}] * 6
    ranks = {}
    for p in g.players:
        if isinstance(p.online_id, list):  # some players have array platform-ids
            p.online_id = p.online_id[0]
            print('array online_id', p.online_id)
        ranks[p.online_id] = get_rank(p.online_id)
    ranks = {p.online_id: get_rank(p.online_id) for p in g.players}
    print(ranks)
    return render_template('replay.html', replay=g, cars=constants.cars, id=id_, ranks=ranks, item_dict=get_item_dict())


@bp.route('/parsed/view/<id_>/positions')
def view_replay_data(id_):
    pickle_path = os.path.join('parsed', id_ + '.replay.pkl')
    replay_path = os.path.join('rlreplays', id_ + '.replay')
    if os.path.isfile(replay_path) and not os.path.isfile(pickle_path):
        return render_template('replay.html', replay=None, id=id_)
    try:
        g = pickle.load(open(os.path.join('parsed', id_ + '.replay.pkl'), 'rb'), encoding='latin1')  # type: Game_pickle
    except Exception as e:
        return return_error('Error opening game: ' + str(e))

    cs = ['pos_x', 'pos_y', 'pos_z']
    rot_cs = ['rot_z', 'rot_y', 'rot_z']
    ball_df = g.ball[cs]
    players_data = [p.data[cs + rot_cs].fillna(0).values.tolist() for p in g.players]

    data = {
        'ball': ball_df.fillna(0).values.tolist(),
        'players': players_data,
        'colors': [p.is_orange for p in g.players]
    }
    return jsonify(data)


@bp.route('/parsed/view/random')
def view_random():
    filelist = os.listdir('parsed')
    return redirect(url_for('replays.view_replay', id_=random.choice(filelist).split('.')[0]))


@bp.route('/download/replay/<id_>')
def download_replay(id_):
    return send_from_directory('rlreplays', id_)


@bp.route('/autoreplays')
def downloader_page():
    return render_template('saltie.html')


# STATS STUFF

@bp.route('/stats')
def replay_stats():
    return render_template('replay-stats.html')


@bp.route('/stats/score')
def score_distribution():
    session = current_app.config['db']()
    data = session.query(PlayerGame.score, func.count(PlayerGame.id)).group_by(PlayerGame.score).filter(
        PlayerGame.score % 10 == 0).order_by(PlayerGame.score).all()
    return jsonify({k: v for k, v in data})


@bp.route('/stats/goals')
def goal_distribution():
    session = current_app.config['db']()
    data = session.query(PlayerGame.goals, func.count(PlayerGame.id)).group_by(PlayerGame.goals).order_by(
        PlayerGame.goals).all()
    return jsonify({k: v for k, v in data if k is not None})


@bp.route('/stats/assists')
def assist_distribution():
    session = current_app.config['db']()
    data = session.query(PlayerGame.assists, func.count(PlayerGame.id)).group_by(PlayerGame.assists).order_by(
        PlayerGame.assists).all()
    return jsonify({k: v for k, v in data if k is not None})


@bp.route('/stats/saves')
def save_distribution():
    session = current_app.config['db']()
    data = session.query(PlayerGame.saves, func.count(PlayerGame.id)).group_by(PlayerGame.saves).order_by(
        PlayerGame.saves).all()
    return jsonify({k: v for k, v in data if k is not None})


@bp.route('/stats/shots')
def shot_distribution():
    session = current_app.config['db']()
    data = session.query(PlayerGame.shots, func.count(PlayerGame.id)).group_by(PlayerGame.shots).order_by(
        PlayerGame.shots).all()
    return jsonify({k: v for k, v in data if k is not None})


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
    return jsonify(car_data)

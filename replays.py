import os
import pickle
import random

from flask import request, redirect, send_from_directory, render_template, url_for, Blueprint, current_app
from werkzeug.utils import secure_filename

import celery_tasks
import constants
from functions import return_error, get_rank, get_item_dict
from objects import Game
from steam import steam_id_to_profile

bp = Blueprint('replays', __name__, url_prefix='/replays')
#
#
# @app.route('/replay/reward/<uid>')
# def get_reward_from_replay(uid):
#     calculate_reward.delay(uid)
#     return redirect('/')

print('Loaded replay app')


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
    return redirect(url_for('view_replay', id_=file.filename.split('.')[0]))


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
    ranks = {p.online_id: get_rank(p.online_id) for p in g.players}
    print(ranks)
    return render_template('replay.html', replay=g, cars=constants.cars, id=id_, ranks=ranks, item_dict=get_item_dict())


@bp.route('/parsed/view/random')
def view_random():
    filelist = os.listdir('parsed')
    return redirect(url_for('view_replay', id_=random.choice(filelist).split('.')[0]))


@bp.route('/parsed/view/player/<id_>')
def view_player(id_):
    session = current_app.config['db']()
    rank = get_rank(id_)
    games = session.query(Game).filter(Game.players.any(str(id_))).all()
    steam_profile = steam_id_to_profile(id_)
    return render_template('player.html', games=games, rank=rank, profile=steam_profile)


@bp.route('/download/replay/<id_>')
def download_replay(id_):
    return send_from_directory('rlreplays', id_)


@bp.route('/autoreplays')
def downloader_page():
    return render_template('saltie.html')
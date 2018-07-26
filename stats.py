# Stats
import datetime
import io
from io import StringIO, BytesIO

from flask import jsonify, Blueprint, g, current_app, send_file, make_response
from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from objects import Replay, Game

bp = Blueprint('stats', __name__, url_prefix='/stats')


@bp.route('/ping')
def ping():
    return jsonify({'status': 'Pong!'})


@bp.route('/uploads/<time>/<model>')
def upload_stats(time, model):
    if time not in ['d', 'h']:
        return jsonify([])
    session = current_app.config['db']()
    if time == 'h':
        result = session.query(extract('year', Replay.upload_date).label('y'),
                               extract('month', Replay.upload_date).label('m'),
                               extract('day', Replay.upload_date).label('d'),
                               extract('hour', Replay.upload_date).label('h'), func.count(Replay.upload_date)).filter(
            Replay.upload_date > datetime.datetime.utcnow() - datetime.timedelta(hours=24))
    else:  # day
        result = session.query(extract('year', Replay.upload_date).label('y'),
                               extract('month', Replay.upload_date).label('m'),
                               extract('day', Replay.upload_date).label('d'),
                               func.count(Replay.upload_date)).filter(
            Replay.upload_date > datetime.datetime.utcnow() - datetime.timedelta(days=30))
    if model != '*':
        result = result.filter(Replay.model_hash.startswith(model))
    result = result.group_by('y').group_by(
        'm').group_by('d')
    if time == 'h':
        result = result.group_by('h')
    result = result.all()
    if time == 'h':
        result = [{
            'year': r[0],
            'month': r[1],
            'day': r[2],
            'hour': r[3],
            'count': r[4]
        } for r in result[::-1]]
        result = sorted(result, key=lambda x: x['year'] * 365 + x['month'] * 30 + x['day'] + x['hour'] * (1 / 24.0))
    else:
        result = [{
            'year': r[0],
            'month': r[1],
            'day': r[2],
            'count': r[3]
        } for r in result[::-1]]
        result = sorted(result, key=lambda x: x['year'] * 365 + x['month'] * 30 + x['day'])
    return jsonify(result)


@bp.route('/mmrs')
def rl_stats():
    import numpy as np
    mmrs = get_mmr_array()
    data = np.histogram(mmrs, bins=200)
    return jsonify({'data': data[0].tolist(), 'bins': data[1].tolist()})


@bp.route('/mmrs/image')
def rl_stats_img():
    from matplotlib.figure import Figure
    mmrs = get_mmr_array()
    fig = Figure()
    ax = fig.add_subplot(111)
    ax.hist(mmrs, bins=200)
    ax.set_title('MMR Histogram')
    ax.set_xlabel('MMR')
    r = get_mpl_response(fig)
    return r


@bp.route('/ranks')
def rl_stats_ranks():
    import numpy as np
    ranks = get_rank_array()
    ranks = ranks[ranks != 0]
    # print(mmrs)
    data = np.histogram(ranks, bins=np.arange(0, 21))
    # print(data)
    return jsonify({'data': data[0].tolist(), 'bins': data[1].tolist()})


@bp.route('/ranks/image')
def rl_stats_img_ranks():
    import numpy as np
    ranks = get_rank_array()
    ranks = ranks[ranks != 0]
    from matplotlib.figure import Figure
    fig = Figure()
    ax = fig.add_subplot(111)
    ax.hist(ranks, bins=np.arange(0, 21))
    ax.set_title('Rank Histogram')
    ax.set_xlabel('Rank')
    ax.set_xticks(np.arange(0, 21))
    r = get_mpl_response(fig)
    return r


def get_mpl_response(fig):
    from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
    f = BytesIO()

    FigureCanvas(fig).print_png(f)

    f.seek(0)
    r = make_response(f.getvalue())
    r.headers['Content-Type'] = 'image/png'
    return r


def get_mmr_array():
    import numpy as np
    session = current_app.config['db']()  # type: Session
    games = session.query(Game.mmrs).all()
    mmrs = np.array([])
    for g in games:
        mmrs = np.concatenate((mmrs, g.mmrs))
    return mmrs


def get_rank_array():
    import numpy as np
    session = current_app.config['db']()  # type: Session
    games = session.query(Game.ranks).all()
    arr = np.array([])
    for g in games:
        arr = np.concatenate((arr, g.ranks))
    return arr

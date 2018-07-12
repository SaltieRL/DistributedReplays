# Stats
import datetime

from flask import jsonify
from sqlalchemy import extract, func

from RLBotServer import app, Session
from objects import Replay


@app.route('/ping')
def ping():
    return jsonify({'status': 'Pong!'})


@app.route('/uploads/<time>/<model>')
def upload_stats(time, model):
    if time not in ['d', 'h']:
        return jsonify([])
    session = Session()
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

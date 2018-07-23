import datetime
import fnmatch
import hashlib
import io
import json
import os
import random
import uuid
import zipfile

import flask_login
from flask import render_template, request, jsonify, redirect, send_from_directory, url_for, send_file, Blueprint, g, \
    current_app
from sqlalchemy.exc import InvalidRequestError
from werkzeug.utils import secure_filename

import queries 
from functions import allowed_file, model_dir, return_error, replay_dir, get_replay_path
from objects import Model, User, Replay

last_upload = {}

bp = Blueprint('saltie', __name__, url_prefix='/saltie')
@bp.route('/admin')
@flask_login.login_required
def admin():
    # 'Logged in as: ' + flask_login.current_user.id
    session = current_app.config['db']()
    models = session.query(Model).all()
    return render_template('admin.html', models=models)


# Replay uploading
@bp.route('/upload/replay/test', methods=['GET'])
def upload_replay_test():
    return upload_replay(True)


@bp.route('/upload/replay', methods=['POST'])
def upload_replay(test=False):
    session = current_app.config['db']()
    user = ''
    # passing username and create new user if it does not exist
    if 'username' in request.form and request.form['username'] != '':
        user = request.form['username']
        queries.create_user_if_not_exist(session, user)
    # check if the post request has the file part
    if 'file' not in request.files and not test:
        return jsonify({'status': 'No file uploaded'})
    file = request.files['file'] if not test else ''
    # if user does not select file, browser also
    # submit a empty part without filename
    if not test and file.filename == '':
        return jsonify({'status': 'No selected file'})
    # if request.remote_addr not in last_upload:
    #     last_upload[request.remote_addr] = datetime.datetime.now() - datetime.timedelta(minutes=15)
    # time_difference = datetime.datetime.now() - last_upload[request.remote_addr]
    # min_last_upload = (time_difference.total_seconds() / 60.0)
    if test or (file and allowed_file(file.filename)):  # and min_last_upload > UPLOAD_RATE_LIMIT_MINUTES:
        u = uuid.uuid4()
        filename = str(u) + '.gz'
        if user == '':
            user_id = -1
        else:
            result = session.query(User).filter(User.name == user).first()
            if result is not None:
                user_id = result.id
            else:
                user_id = -1

        if 'is_eval' in request.form:
            is_eval = request.form['is_eval']
        else:
            is_eval = False
        if 'hash' in request.form:
            model_hash = request.form['hash']
            if len(model_hash) < 8:
                return jsonify({'status': 'Invalid hash. Must be 8 characters.'})
        else:
            model_hash = ''
            return jsonify({'status': 'No hash supplied, not allowed.'})
        if 'num_players' in request.form:
            num_players = request.form['num_players']
        else:
            num_players = 0
        if 'num_my_team' in request.form:
            num_my_team = request.form['num_my_team']
        else:
            num_my_team = 0

        queries.create_model_if_not_exist(session, model_hash)
        if not test:
            try:
                session.commit()
            except Exception as e:
                print('Error with models:', e)
                return jsonify({})
        f = Replay(uuid=u, user=user_id, ip=str(request.remote_addr),
                   model_hash=model_hash, num_team0=num_my_team, num_players=num_players,
                   is_eval=str(is_eval) not in ['False', 'f', '0'])
        session.add(f)
        if not test:
            file.save(os.path.join(bp.config['UPLOAD_FOLDER'], filename))
        last_upload[request.remote_addr] = datetime.datetime.now()
        if not test:
            session.commit()
        return jsonify({'status': 'Success'})
    # elif min_last_upload < UPLOAD_RATE_LIMIT_MINUTES:
    #     return jsonify({'status': 'Try again later', 'seconds': 60 * (UPLOAD_RATE_LIMIT_MINUTES - min_last_upload)})
    elif not allowed_file(file.filename):
        return jsonify({'status': 'Not an allowed file'})
    return jsonify({})


# Config management


@bp.route('/config/get')
def get_config():
    if not os.path.isfile('config.cfg'):
        with open('config.cfg', 'w') as f:
            f.writelines(['[Test]', 'Please set proper config using admin interface.'])
    with open('config.cfg', 'r') as f:
        file_str = f.read()
    return jsonify({'version': 1, 'content': file_str})


@bp.route('/admin/config/set', methods=['GET', 'POST'])
@flask_login.login_required
def set_config():
    if request.method == 'POST':
        request.files['file'].save('config.cfg')
        return redirect('/admin')
    return "this doesn't do anything"


# Model management


@bp.route('/model/get/<hash>')
def get_model(hash):
    if len(hash) < 8:
        return jsonify([])
    session = current_app.config['db']()
    model = session.query(Model).filter(Model.model_hash.like(hash + "%")).first()
    if model:
        return send_from_directory(model_dir, model.model_hash + '.zip', as_attachment=True,
                                   attachment_filename=model.model_hash + '.zip')
    return jsonify([])


@bp.route('/admin/model/upload', methods=['POST'])
@flask_login.login_required
def upload_model():
    session = current_app.config['db']()
    # check if the post request has the file part
    if 'file' not in request.files:
        return return_error('No file part')
    file = request.files['file']
    # if user does not select file, browser also
    # submit a empty part without filename
    if file.filename == '':
        return return_error('No selected file')
    key = hashlib.sha1(file.read()).hexdigest()
    file.seek(0)
    file.filename = key + '.zip'
    if file and file.filename.endswith('.zip'):
        filename = secure_filename(file.filename)
        model = Model(model_hash=key, model_size=0, model_type=0, total_reward=0.0, evaluated=False)
        session.add(model)
        file.save(os.path.join(model_dir, filename))
        session.commit()
        return redirect(url_for('admin'))
    return return_error('file type not allowed')


@bp.route('/admin/model/delete/<h>')
def delete_model(h):
    session = current_app.config['db']()
    m = session.query(Model).filter(Model.model_hash == h).first()
    session.delete(m)
    session.commit()
    return redirect(url_for('admin'))


@bp.route('/model/list')
def list_model():
    session = current_app.config['db']()
    models = session.query(Model).all()
    return jsonify([{'model_hash': m.model_hash, 'model_type': m.model_type, 'model_size': m.model_size,
                     'total_reward': m.total_reward, 'evaluated': m.evaluated,
                     'model_link': url_for('get_model', hash=m.model_hash)} for m in models])


# Replay management
@bp.route('/replays/list')
def list_replays():
    session = current_app.config['db']()
    if request.method == 'GET':
        fs = [f.split('_')[-1] for f in os.listdir('replays/')]
        if 'all' in request.args:
            return jsonify(fs)
        rs = session.query(Replay)
        for arg in request.args:
            try:
                rs = rs.filter_by(**{arg: request.args.get(arg)})
            except (AttributeError, InvalidRequestError) as e:
                return jsonify(
                    {'status': 'error', 'exception': str(e), 'message': 'Property "{}" does not exist.'.format(arg)})
        rs = [r.uuid + '.gz' for r in rs.all()]
        return jsonify(list(set(rs) & set(fs)))
    return ''


@bp.route('/replays/download/<n>')
def download_zipped_replays(n):
    filenames = random.sample(os.listdir(replay_dir), int(n))
    file_like_object = io.BytesIO()
    with zipfile.ZipFile(file_like_object, "w", zipfile.ZIP_DEFLATED) as zipfile_ob:
        for f in filenames:
            print(f)
            zipfile_ob.write(get_replay_path(f, add_extension=False), f)
    file_like_object.seek(0)
    return send_file(file_like_object, attachment_filename='dl.zip')


@bp.route('/replays/download', methods=['POST'])  # downloads based on filenames from /replays/list
def download_zipped_replays_fn():
    print(request.form['files'])
    filenames = list(set(os.listdir(replay_dir)) & set(json.loads(request.form['files'])))
    file_like_object = io.BytesIO()
    with zipfile.ZipFile(file_like_object, "w", zipfile.ZIP_DEFLATED) as zipfile_ob:
        for f in filenames:
            print(f)
            zipfile_ob.write(get_replay_path(f, add_extension=False), f)
    file_like_object.seek(0)
    return send_file(file_like_object, attachment_filename='dl.zip')


@bp.route('/replays/eval/<hash>')
def list_replays_by_hash(hash):
    session = current_app.config['db']()
    replays = [f.uuid + '.gz' for f in
               session.query(Replay).filter(Replay.model_hash.like("%{}%".format(hash))).all() if
               fnmatch.fnmatch('*{}*'.format(f.uuid))]
    return jsonify(replays)


@bp.route('/replays/<name>')
def get_replay(name):
    if request.method == 'GET':
        fs = os.listdir('replays/')
        filename = [f for f in fs if name in f][0]
        return send_from_directory('replays', filename, as_attachment=True, attachment_filename=filename.split('_')[-1])


@bp.route('/replays/info/<uuid>')
@flask_login.login_required
def replay_info(uuid):
    session = current_app.config['db']()
    replay = session.query(Replay).filter(Replay.uuid == uuid).first()
    if replay is None:
        return jsonify({})
    info = {
        'user': session.query(User).filter(User.id == replay.user).first().name + ' (ID: ' + str(replay.user) + ')',
        'model_hash': replay.model_hash,
        'ip': replay.ip,
        'is_eval': replay.is_eval,
        'num_players': replay.num_players,
        'num_team0': replay.num_team0,
        'upload_date': replay.upload_date,
        'uuid': replay.uuid,
        'id': replay.id
    }
    return jsonify(info)

import datetime
import fnmatch
import glob
import hashlib
import os
import uuid

import flask
import flask_login
import pandas as pd
from flask import Flask, request, jsonify, send_file, render_template, redirect, url_for
from numpy import extract
from sqlalchemy import func
from sqlalchemy.exc import InvalidRequestError
from werkzeug.utils import secure_filename

import config
import queries
from objects import User, Replay, Model
from startup import startup

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(
        os.path.realpath(__file__)), 'replays')
ALLOWED_EXTENSIONS = {'bin', 'gz'}
UPLOAD_RATE_LIMIT_MINUTES = 4.5
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 512 * 1024 * 1024
app.secret_key = config.SECRET_KEY

engine, Session = startup()

# Login stuff
login_manager = flask_login.LoginManager()

login_manager.init_app(app)

users = config.users

# Replay stuff
replay_dir = os.path.join(os.path.dirname(__file__), 'replays')
if not os.path.isdir(replay_dir):
    os.mkdir(replay_dir)
last_upload = {}


# Functions
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def return_error(msg):
    return jsonify({'error': msg})


# Admin stuff
class LoginUser(flask_login.UserMixin):
    pass


@login_manager.user_loader
def user_loader(email):
    if email not in users:
        return

    user = LoginUser()
    user.id = email
    return user


@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    if email not in users:
        return

    user = LoginUser()
    user.id = email

    # DO NOT ever store passwords in plaintext and always compare password
    # hashes using constant-time comparison!
    user.is_authenticated = request.form['password'] == users[email]

    return user


@app.route('/login', methods=['GET', 'POST'])
def login():
    if flask.request.method == 'GET':
        return '''
               <form action='login' method='POST'>
                <input type='text' name='email' id='email' placeholder='email'/>
                <input type='password' name='password' id='password' placeholder='password'/>
                <input type='submit' name='submit'/>
               </form>
               '''

    email = flask.request.form['email']
    if flask.request.form['password'] == users[email]['password']:
        user = LoginUser()
        user.id = email
        flask_login.login_user(user)
        return flask.redirect(flask.url_for('admin'))

    return 'Bad login'


@app.route('/logout')
def logout():
    flask_login.logout_user()
    return 'Logged out'


@login_manager.unauthorized_handler
def unauthorized_handler():
    return 'Unauthorized'


# Main stuff
@app.route('/', methods=['GET', 'POST'])
def home():
    session = Session()
    replay_count = queries.get_replay_count(session)
    replay_data = queries.get_replay_stats(session)
    model_data = queries.get_model_stats(session)

    # fs = glob.glob(os.path.join('replays', '*'))
    # df = pd.DataFrame(fs, columns=['FILENAME'])
    # df['IP_PREFIX'] = df['FILENAME'].apply(lambda x: ".".join(x.split('\\')[-1].split('/')[-1].split('.')[0:2]))
    # stats = df.groupby(by='IP_PREFIX').count().sort_values(by='FILENAME', ascending=False).reset_index().as_matrix()
    return render_template('index.html', stats=replay_data, total=replay_count, model_stats=model_data)

@app.route('/upload/replay/test', methods=['GET'])
def upload_replay_test():
    return upload_replay(True)

@app.route('/upload/replay', methods=['POST'])
def upload_replay(test=False):
    session = Session()
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
        else:
            model_hash = ''
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
            session.commit()
        f = Replay(uuid=u, user=user_id, ip=str(request.remote_addr),
                   model_hash=model_hash, num_team0=num_my_team, num_players=num_players, is_eval=is_eval)
        session.add(f)
        if not test:
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        last_upload[request.remote_addr] = datetime.datetime.now()
        if not test:
            session.commit()
        return jsonify({'status': 'Success'})
    # elif min_last_upload < UPLOAD_RATE_LIMIT_MINUTES:
    #     return jsonify({'status': 'Try again later', 'seconds': 60 * (UPLOAD_RATE_LIMIT_MINUTES - min_last_upload)})
    elif not allowed_file(file.filename):
        return jsonify({'status': 'Not an allowed file'})
    return jsonify({})


@app.route('/config/get')
def get_config():
    if not os.path.isfile('config.cfg'):
        with open('config.cfg', 'w') as f:
            f.writelines(['[Test]', 'Please set proper config using admin interface.'])
    with open('config.cfg', 'r') as f:
        file_str = f.read()
    return jsonify({'version': 1, 'content': file_str})


@app.route('/admin/config/set', methods=['GET', 'POST'])
@flask_login.login_required
def set_config():
    if request.method == 'POST':
        request.files['file'].save('config.cfg')
        return redirect('/admin')
    return "this doesn't do anything"


@app.route('/model/get/<hash>')
def get_model(hash):
    session = Session()
    model = session.query(Model).filter(Model.model_hash.like(hash + "%")).first()
    if model:
        return send_file(os.path.join(replay_dir, model.model_hash + '.zip'), as_attachment=True, attachment_filename=model.model_hash + '.zip')
    return jsonify([])


# @app.route('/model/get/<hash>')
# def get_model_hash(hash):
#     fs = glob.glob('models/*.zip')
#     filtered = [f for f in fs if f.startswith(hash)]
#     if len(filtered) > 0:
#         return send_file(filtered[0])
#     return jsonify([])


@app.route('/admin/model/set', methods=['GET', 'POST'])
@flask_login.login_required
def set_model():
    if request.method == 'POST':
        request.files['file'].save('recent.zip')
        hash = hashlib.sha1()
        if not os.path.isdir('models/'):
            os.makedirs('models/')
        with open('recent.zip', 'rb') as f:
            buf = f.read()
            hash.update(buf)
        request.files['file'].seek(0)
        request.files['file'].save(os.path.join('models', hash.hexdigest() + '.zip'))
        return redirect('/admin')
    return "this doesn't do anything"


@app.route('/admin/model/upload', methods=['POST'])
@flask_login.login_required
def upload_model():
    session = Session()
    # check if the post request has the file part
    if 'file' not in request.files:
        return return_error('No file part')
    file = request.files['file']
    # if user does not select file, browser also
    # submit a empty part without filename
    if file.filename == '':
        return return_error('No selected file')
    key = hashlib.sha1(file.read()).hexdigest()
    file.filename = key + '.zip'
    if file and file.filename.endswith('.zip'):
        filename = secure_filename(file.filename)
        model = Model(model_hash=key, model_size=0, model_type=0, total_reward=0.0, evaluated=False)
        session.add(model)
        file.save(os.path.join(replay_dir, filename))
        session.commit()
        return redirect(url_for('admin'))
    return return_error('file type not allowed')

@app.route('/admin/model/delete')
def delete_model():
    session = Session()
    m = session.query(Model).filter(Model.model_hash == request.args['hash']).first()
    session.delete(m)
    session.commit()
    return redirect(url_for('admin'))

@app.route('/model/list')
def list_model():
    if not os.path.isdir('models/'):
        os.makedirs('models/')
    return jsonify([os.path.basename(f) for f in glob.glob('models/*.zip')])


@app.route('/admin')
@flask_login.login_required
def admin():
    # 'Logged in as: ' + flask_login.current_user.id
    session = Session()
    models = session.query(Model).all()
    return render_template('admin.html', models=models)


@app.route('/replays/list')
def list_replays():
    session = Session()
    if request.method == 'GET':
        rs = session.query(Replay)
        for arg in request.args:
            try:
                rs = rs.filter_by(**{arg: request.args.get(arg)})
            except (AttributeError, InvalidRequestError) as e:
                return jsonify(
                    {'status': 'error', 'exception': str(e), 'message': 'Property {} does not exist.'.format(arg)})
        rs = [r.uuid + '.gz' for r in rs.all()]
        fs = [f.split('_')[-1] for f in os.listdir('replays/')]

        return jsonify(list(set(rs) & set(fs)))
    return ''

@app.route('/replays/eval/<hash>')
def list_replays_by_hash(hash):
    session = Session()
    replays = [f.uuid + '.gz' for f in
               session.query(Replay).filter(Replay.model_hash.like("%{}%".format(hash))).all() if
               fnmatch.fnmatch('*{}*'.format(f.uuid))]
    return jsonify(replays)

@app.route('/replays/<name>')
def get_replay(name):
    if request.method == 'GET':
        fs = os.listdir('replays/')
        filename = [f for f in fs if name in f][0]
        return send_file('replays/' + filename, as_attachment=True, attachment_filename=filename.split('_')[-1])


# Stats stuff

@app.route('/ping')
def ping():
    return jsonify({'status': 'Pong!'})


@app.route('/uploads/<time>')
def upload_stats(time):
    session = Session()
    if time == 'h':
        r = pd.date_range(end=pd.datetime.now(), freq='H', periods=24)

        result = session.query(extract('year', Replay.upload_date).label('y'),
                               extract('month', Replay.upload_date).label('m'),
                               extract('day', Replay.upload_date).label('d'),
                               extract('hour', Replay.upload_date).label('h'), func.count(Replay.upload_date)).filter(
            Replay.upload_date > datetime.datetime.utcnow() - datetime.timedelta(hours=24)).group_by('y').group_by(
            'm').group_by('d').group_by('h').all()
    elif time == 'd':
        r = pd.date_range(end=pd.datetime.today(), periods=30)
        result = session.query(extract('year', Replay.upload_date).label('y'),
                               extract('month', Replay.upload_date).label('m'),
                               extract('day', Replay.upload_date).label('d'), func.count(Replay.upload_date)).filter(
            Replay.upload_date > datetime.datetime.utcnow() - datetime.timedelta(days=30)).group_by('y').group_by(
            'm').group_by('d').all()
    else:
        r = None
        result = []
    return jsonify(result[::-1])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

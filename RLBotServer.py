import datetime
import fnmatch
import hashlib
import io
import json
import os
import pickle
import random
import sys
import uuid
import zipfile

import flask
import flask_login
from flask import Flask, request, jsonify, send_file, render_template, redirect, url_for, send_from_directory
from sqlalchemy import extract
from sqlalchemy import func
from sqlalchemy.exc import InvalidRequestError
from werkzeug.utils import secure_filename

import config
import queries
# import rewards
from replayanalysis.game.game import Game
from objects import User, Replay, Model
from startup import startup
from replayanalysis.decompile_replays import decompile_replay

# APP SETUP
from tasks import make_celery
sys.path.append('replayanalysis')
engine, Session = startup()
UPLOAD_FOLDER = os.path.join(
    os.path.dirname(
        os.path.realpath(__file__)), 'replays')
ALLOWED_EXTENSIONS = {'bin', 'gz'}
UPLOAD_RATE_LIMIT_MINUTES = 4.5
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 512 * 1024 * 1024
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config.update(
    CELERY_BROKER_URL='amqp://guest@localhost',
    CELERY_RESULT_BACKEND='amqp://guest@localhost'
)
# app.wsgi_app = StreamConsumingMiddleware(app.wsgi_app)
celery = make_celery(app)
app.secret_key = config.SECRET_KEY
# Login stuff
login_manager = flask_login.LoginManager()

login_manager.init_app(app)

users = config.users

# Replay stuff
replay_dir = os.path.join(os.path.dirname(__file__), 'replays')
if not os.path.isdir(replay_dir):
    os.mkdir(replay_dir)
model_dir = os.path.join(os.path.dirname(__file__), 'models')
if not os.path.isdir(model_dir):
    os.mkdir(model_dir)
last_upload = {}


# Functions
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def return_error(msg):
    return jsonify({'error': msg})


def get_replay_path(uid, add_extension=True):
    return os.path.join(replay_dir, uid + ('.gz' if add_extension else ''))


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
    if flask.request.form['password'] == users[email]:
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


@app.route('/admin')
@flask_login.login_required
def admin():
    # 'Logged in as: ' + flask_login.current_user.id
    session = Session()
    models = session.query(Model).all()
    return render_template('admin.html', models=models)


# Replay uploading
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


# Config management


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


# Model management


@app.route('/model/get/<hash>')
def get_model(hash):
    if len(hash) < 8:
        return jsonify([])
    session = Session()
    model = session.query(Model).filter(Model.model_hash.like(hash + "%")).first()
    if model:
        return send_from_directory(model_dir, model.model_hash + '.zip', as_attachment=True,
                                   attachment_filename=model.model_hash + '.zip')
    return jsonify([])


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


@app.route('/admin/model/delete/<h>')
def delete_model(h):
    session = Session()
    m = session.query(Model).filter(Model.model_hash == h).first()
    session.delete(m)
    session.commit()
    return redirect(url_for('admin'))


@app.route('/model/list')
def list_model():
    session = Session()
    models = session.query(Model).all()
    return jsonify([{'model_hash': m.model_hash, 'model_type': m.model_type, 'model_size': m.model_size,
                     'total_reward': m.total_reward, 'evaluated': m.evaluated,
                     'model_link': url_for('get_model', hash=m.model_hash)} for m in models])


# Replay management
@app.route('/replays/list')
def list_replays():
    session = Session()
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


@app.route('/replays/download/<n>')
def download_zipped_replays(n):
    filenames = random.sample(os.listdir(replay_dir), int(n))
    file_like_object = io.BytesIO()
    with zipfile.ZipFile(file_like_object, "w", zipfile.ZIP_DEFLATED) as zipfile_ob:
        for f in filenames:
            print(f)
            zipfile_ob.write(get_replay_path(f, add_extension=False), f)
    file_like_object.seek(0)
    return send_file(file_like_object, attachment_filename='dl.zip')


@app.route('/replays/download', methods=['POST'])  # downloads based on filenames from /replays/list
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
        return send_from_directory('replays', filename, as_attachment=True, attachment_filename=filename.split('_')[-1])


@app.route('/replays/info/<uuid>')
@flask_login.login_required
def replay_info(uuid):
    session = Session()
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


# Stats

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


# Replay stuff
#
# @app.route('/replay/info', methods=['POST'])
# def rl_replay_info():
#     if 'file' not in request.files:
#         return return_error('No file part')
#     file = request.files['file']
#     # if user does not select file, browser also
#     # submit a empty part without filename
#     if file.filename == '':
#         return return_error('No selected file')
#     r = pyrope_replay(file.stream)
#     return '{]'
#

@app.route('/replay/reward/<uid>')
def get_reward_from_replay(uid):
    calculate_reward.delay(uid)
    return redirect('/')


@app.route('/replay/parse', methods=['POST'])
def parse_replay():
    if 'file' not in request.files:
        return return_error('No file part')
    file = request.files['file']
    if not file.filename.endswith('replay'):
        return return_error('Only .replay files are allowed.')
    filename = os.path.join('rlreplays', secure_filename(file.filename))
    file.save(filename)
    parse_replay_task.delay(os.path.abspath(filename))
    return redirect(url_for('view_replay', id_=file.filename.split('.')[0]))


@app.route('/parsed/list')
def list_parsed_replays():
    fs = os.listdir('parsed/')
    return jsonify(fs)


@app.route('/parsed/<path:fn>')
def download_parsed(fn):
    return send_from_directory('parsed', fn, as_attachment=True)


@app.route('/parse/replays')
def parse_replays():
    for f in os.listdir('rlreplays'):
        if f.endswith('.replay'):
            result = parse_replay_task.delay(os.path.abspath(os.path.join('rlreplays', f)))
            break
    return redirect('/')

@app.route('/parsed/view/<id_>')
def view_replay(id_):
    pickle_path = os.path.join('parsed', id_ + '.replay.pkl')
    replay_path = os.path.join('rlreplays', id_ + '.replay')
    if os.path.isfile(replay_path) and not os.path.isfile(pickle_path):
        return render_template('replay.html', replay=None)
    try:
        g = pickle.load(open(os.path.join('parsed', id_ + '.replay.pkl'), 'rb'))  # type: Game
    except Exception as e:
        return return_error('Error opening game: ' + str(e))
    return render_template('replay.html', replay=g)


@app.route('/parsed/view/random')
def view_random():
    filelist = os.listdir('parsed')
    return redirect(url_for('view_replay', id_=random.choice(filelist).split('.')[0]))

# Celery workers

@celery.task(bind=True)
def calculate_reward(self, uid):
    calc = rewards.RewardCalculator()
    reward = calc.read_file(get_replay_path(uid))
    session = Session()
    r = session.query(Replay).filter(Replay.uuid == uid).first()
    # TODO: Update replay reward in db
    print(reward)


@celery.task(bind=True)
def parse_replay_task(self, fn):
    output = fn + '.json'
    g = decompile_replay(fn, output)
    with open(os.path.join(os.path.dirname(__file__), 'parsed', os.path.basename(fn) + '.pkl'), 'wb') as f:
        pickle.dump(g, f)
    os.system('rm ' + output)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

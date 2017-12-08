import datetime
import glob
import hashlib
import os
import uuid

import flask
import flask_login
import pandas as pd
from flask import Flask, request, jsonify, send_file, render_template, redirect

import config

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(
        os.path.realpath(__file__)), 'replays')
ALLOWED_EXTENSIONS = {'bin', 'gz'}
UPLOAD_RATE_LIMIT_MINUTES = 4.5
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 512 * 1024 * 1024
app.secret_key = config.SECRET_KEY

# Login stuff
login_manager = flask_login.LoginManager()

login_manager.init_app(app)

users = config.users

# Replay stuff
if not os.path.isdir('replays/'):
    os.mkdir('replays/')
last_upload = {}


# Functions
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Admin stuff
class User(flask_login.UserMixin):
    pass


@login_manager.user_loader
def user_loader(email):
    if email not in users:
        return

    user = User()
    user.id = email
    return user


@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    if email not in users:
        return

    user = User()
    user.id = email

    # DO NOT ever store passwords in plaintext and always compare password
    # hashes using constant-time comparison!
    user.is_authenticated = request.form['password'] == users[email]['password']

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
        user = User()
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
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({'status': 'No file uploaded'})
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            return jsonify({'status': 'No selected file'})
        if request.remote_addr not in last_upload:
            last_upload[request.remote_addr] = datetime.datetime.now() - datetime.timedelta(minutes=15)
        time_difference = datetime.datetime.now() - last_upload[request.remote_addr]
        min_last_upload = (time_difference.total_seconds() / 60.0)
        if file and allowed_file(file.filename):  # and min_last_upload > UPLOAD_RATE_LIMIT_MINUTES:
            # h = hashlib.sha1()
            # for b in iter(lambda: file.stream.read(128 * 1024), b''):
            #     h.update(b)
            # h.hexdigest()
            filename = str(request.remote_addr) + '_' + str(uuid.uuid4()) + '.gz'
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            last_upload[request.remote_addr] = datetime.datetime.now()
            return jsonify({'status': 'Success'})
        elif min_last_upload < UPLOAD_RATE_LIMIT_MINUTES:
            return jsonify({'status': 'Try again later', 'seconds': 60 * (UPLOAD_RATE_LIMIT_MINUTES - min_last_upload)})
        elif not allowed_file(file.filename):
            return jsonify({'status': 'Not an allowed file'})

    fs = glob.glob(os.path.join('replays', '*'))
    df = pd.DataFrame(fs, columns=['FILENAME'])
    df['IP_PREFIX'] = df['FILENAME'].apply(lambda x: ".".join(x.split('\\')[-1].split('/')[-1].split('.')[0:2]))
    stats = df.groupby(by='IP_PREFIX').count().sort_values(by='FILENAME', ascending=False).reset_index().as_matrix()
    return render_template('index.html', stats=stats, total=len(fs))


@app.route('/config/get')
def get_config():
    if not os.path.isfile('config.cfg'):
        with open('config.cfg', 'w') as f:
            f.writelines(['[Test]', 'Please set proper config using admin interface.'])
    with open('config.cfg', 'r') as f:
        file_str = f.read()
    return jsonify({'version': 1, 'content': file_str})


@app.route('/config/set', methods=['GET', 'POST'])
@flask_login.login_required
def set_config():
    if request.method == 'POST':
        request.files['file'].save('config.cfg')
        return redirect('/admin')
    return "this doesn't do anything"


@app.route('/model/get')
def get_model():
    if os.path.isfile('recent.zip'):
        return send_file('recent.zip', as_attachment=True, attachment_filename='recent.zip')
    return jsonify([])


@app.route('/model/get/<hash>')
def get_model_hash(hash):
    fs = glob.glob('models/*.zip')
    filtered = [f for f in fs if f.startswith(hash)]
    if len(filtered) > 0:
        return send_file(filtered[0])
    return jsonify([])


@app.route('/model/set', methods=['GET', 'POST'])
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


@app.route('/model/list')
def list_model():
    if not os.path.isdir('models/'):
        os.makedirs('models/')
    return jsonify([os.path.basename(f) for f in glob.glob('models/*.zip')])


@app.route('/admin')
@flask_login.login_required
def admin():
    # 'Logged in as: ' + flask_login.current_user.id
    return render_template('admin.html')


@app.route('/replays/list')
def list_replays():
    if request.method == 'GET':
        fs = os.listdir('replays/')
        return jsonify([f.split('_')[-1] for f in fs])
    return ''


@app.route('/replays/<name>')
def get_replay(name):
    if request.method == 'GET':
        fs = os.listdir('replays/')
        filename = [f for f in fs if name in f][0]
        return send_file('replays/' + filename, as_attachment=True, attachment_filename=filename.split('_')[-1])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

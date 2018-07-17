import datetime
import fnmatch
import hashlib
import io
import json
import os
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
from functions import allowed_file, return_error, get_replay_path
from objects import User, Replay, Model
from startup import startup

# APP SETUP

print("Name:", __name__)
sys.path.append('replayanalysis')
engine, Session = startup()
UPLOAD_FOLDER = os.path.join(
    os.path.dirname(
        os.path.realpath(__file__)), 'replays')
UPLOAD_RATE_LIMIT_MINUTES = 4.5
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 512 * 1024 * 1024
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config.update(
    CELERY_BROKER_URL='amqp://guest@localhost',
    CELERY_RESULT_BACKEND='amqp://guest@localhost'
)

# Import modules AFTER app is initialized

import celery_tasks
import replays, saltie, stats, api

print(replays, celery_tasks, saltie, stats, api)  # prevents ide from removing it

app.secret_key = config.SECRET_KEY
# Login stuff
login_manager = flask_login.LoginManager()

login_manager.init_app(app)

users = config.users


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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

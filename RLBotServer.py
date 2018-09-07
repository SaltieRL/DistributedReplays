import logging
import os
import sys

import flask
import flask_login
from flask import Flask, render_template, g, current_app, session, request, redirect
from flask_cors import CORS

try:
    import config
except ImportError:
    print('No config exists', file=sys.stderr)
    config = None

sys.path.append(os.path.abspath('replayanalysis/'))

try:
    from config import ALLOWED_STEAM_ACCOUNTS
except ImportError:
    ALLOWED_STEAM_ACCOUNTS = []
    users = []

from blueprints import auth, api, players, replays, stats, steam, debug
from database.objects import Game, Player, Group
from database.startup import startup
import redis

logger = logging.getLogger(__name__)

# APP SETUP

print("Name:", __name__)
print(os.path.abspath('replayanalysis/'))
engine, Session = startup()
UPLOAD_FOLDER = os.path.join(
    os.path.dirname(
        os.path.realpath(__file__)), 'replays')
UPLOAD_RATE_LIMIT_MINUTES = 4.5
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 512 * 1024 * 1024
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['BASE_URL'] = 'https://calculated.gg'
app.config['REPLAY_DIR'] = os.path.join(os.path.dirname(__file__), 'data', 'rlreplays')
app.config['PARSED_DIR'] = os.path.join(os.path.dirname(__file__), 'data', 'parsed')
app.config.update(
    CELERY_BROKER_URL='amqp://guest@localhost',
    result_backend='amqp://guest@localhost',
    worker_max_tasks_per_child=100
)
CORS(app)
folders_to_make = [app.config['REPLAY_DIR'], app.config['PARSED_DIR']]
for f in folders_to_make:
    abspath = os.path.join(os.path.dirname(__file__), f)
    if not os.path.isdir(abspath):
        os.makedirs(abspath)
# Import modules AFTER app is initialized
#
with app.app_context():
    # app.register_blueprint(celery_tasks.bp)
    app.register_blueprint(players.bp)
    app.register_blueprint(steam.bp)
    app.register_blueprint(replays.bp)
    # app.register_blueprint(saltie.bp)
    app.register_blueprint(stats.bp)
    app.register_blueprint(api.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(debug.bp)
    try:
        app.secret_key = config.SECRET_KEY
    except:
        logger.warning('no secret key has been set')
    # Login stuff
    login_manager = flask_login.LoginManager()

    login_manager.init_app(app)

    try:
        users = config.users
    except:
        users = []

    app.config['db'] = Session

    # REDIS STUFF
    try:
        r = redis.Redis(
            host='localhost',
            port=6379)
        app.config['r'] = r
    except:
        print('Not using redis...')
        app.config['r'] = None

    s = Session()
    groups_to_add = ['admin', 'alpha', 'beta']
    for group_name in groups_to_add:
        num = s.query(Group).filter(Group.name == group_name).count()
        if num == 0:
            grp = Group(name=group_name)
            s.add(grp)
    ids = {}
    for group_name in groups_to_add:
        ids[group_name] = s.query(Group).filter(Group.name == group_name).first().id
    s.commit()
    s.close()


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


@app.before_request
def lookup_current_user():
    s = current_app.config['db']()
    g.user = None
    allowed_routes = ['/auth', '/api', '/replays/stats']
    allowed = any([request.path.startswith(a) for a in allowed_routes])
    if allowed:
        return
    if 'openid' in session:
        openid = session['openid']
        if len(ALLOWED_STEAM_ACCOUNTS) > 0 and openid not in ALLOWED_STEAM_ACCOUNTS:
            return render_template('login.html')

        g.user = s.query(Player).filter(Player.platformid == openid).first()
        if g.user is None:
            del session['openid']
            return redirect('/')
        g.admin = ids['admin'] in g.user.groups
        g.alpha = ids['alpha'] in g.user.groups
        g.beta = ids['beta'] in g.user.groups
    elif len(ALLOWED_STEAM_ACCOUNTS) > 0:
        return render_template('login.html')
    s.close()


def is_admin():
    return g.admin


def is_alpha():
    return g.admin or g.alpha


def is_beta():
    return g.admin or g.beta


app.jinja_env.globals.update(isAdmin=is_admin)
app.jinja_env.globals.update(isAlpha=is_alpha)
app.jinja_env.globals.update(isBeta=is_beta)


# Main stuff
@app.route('/', methods=['GET', 'POST'])
def home():
    s = current_app.config['db']()
    count = s.query(Game.hash).count()
    return render_template('index.html', game_count=count)


@app.route('/about', methods=['GET'])
def about():
    return render_template('about.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

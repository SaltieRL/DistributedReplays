import logging
import os
import sys

from flask import Flask, render_template, g, current_app, session, request, redirect
from flask_cors import CORS

local_dev = False
try:
    import config
except ImportError:
    print('No config exists', file=sys.stderr)
    config = None
    local_dev = True

if config is not None:
    try:
        api_key = config.RL_API_KEY
        local_dev = False
    except:
        local_dev = True

sys.path.append(os.path.abspath('replayanalysis/'))

try:
    from config import ALLOWED_STEAM_ACCOUNTS
except ImportError:
    ALLOWED_STEAM_ACCOUNTS = []
    users = []

from blueprints import auth, api, players, replays, stats, steam, debug, admin
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
    broker_url='redis://localhost:6379/0',
    result_backend='redis://',
    worker_max_tasks_per_child=100,
    broker_transport_options={'fanout_prefix': True}
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
    app.register_blueprint(admin.bp)
    try:
        app.secret_key = config.SECRET_KEY
    except:
        logger.warning('no secret key has been set')

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
    ids_to_group = {}
    for group_name in groups_to_add:
        i = s.query(Group).filter(Group.name == group_name).first().id
        ids[group_name] = i
        ids_to_group[i] = group_name
    app.config['groups'] = ids_to_group
    s.commit()
    s.close()


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
    s.close()


def is_admin():
    if local_dev:
        return True
    if g.user is None:
        return False
    return g.admin


def is_alpha():
    if is_admin():
        return True
    if g.user is None:
        return False
    return g.alpha


def is_beta():
    if is_admin():
        return True
    if g.user is None:
        return False
    return is_alpha() or g.beta


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

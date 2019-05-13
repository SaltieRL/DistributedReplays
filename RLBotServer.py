import logging
import os
from typing import Dict, List, Tuple

from flask import Flask, render_template, g, request, redirect, send_from_directory
from flask import session as flask_session
from flask_cors import CORS

from backend.blueprints import steam, auth, debug, admin, api
from backend.blueprints.spa_api import spa_api
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Player, Group
from backend.database.startup import lazy_startup, lazy_get_redis
from backend.database.wrapper.player_wrapper import create_default_player
from backend.server_constants import SERVER_PERMISSION_GROUPS, UPLOAD_FOLDER
from backend.utils.checks import is_local_dev
from backend.utils.global_jinja_functions import create_jinja_globals

logger = logging.getLogger(__name__)
logger.info("Setting up server.")


def start_app() -> Tuple[Flask, Dict[str, int]]:
    # APP SETUP
    app = Flask(__name__,
                template_folder=os.path.join('frontend', 'templates'),
                static_folder=os.path.join('frontend', 'static'),
                static_url_path='/static2')
    set_up_app_config(app)
    CORS(app)
    create_needed_folders(app)

    session_factory = lazy_startup()

    with app.app_context():
        register_blueprints(app)

        try:
            import config
            app.secret_key = config.SECRET_KEY
        except:  # TODO: Specify necessary excepts here.
            logger.warning('No secret key has been set')

        app.config['db'] = session_factory
        app.config['r'] = lazy_get_redis()

        _session = session_factory()

        add_needed_groups_to_db(_session, SERVER_PERMISSION_GROUPS)
        ids, ids_to_group = get_id_group_dicts(_session, SERVER_PERMISSION_GROUPS)
        app.config['groups'] = ids_to_group
        _session.commit()
        _session.close()

    create_jinja_globals(app, g)

    return app, ids


def create_needed_folders(app: Flask):
    folders_to_make = [app.config['REPLAY_DIR'], app.config['PARSED_DIR']]
    for f in folders_to_make:
        abspath = os.path.join(os.path.dirname(__file__), f)
        if not os.path.isdir(abspath):
            os.makedirs(abspath)


def set_up_app_config(app: Flask):
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


def register_blueprints(app: Flask):
    app.register_blueprint(steam.bp)
    app.register_blueprint(api.bp)
    app.register_blueprint(spa_api.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(debug.bp)
    app.register_blueprint(admin.bp)


def add_needed_groups_to_db(_session, groups_to_add: List[str]):
    for group_name in groups_to_add:
        group_name_query = _session.query(Group).filter(Group.name == group_name)
        if not _session.query(group_name_query.exists()).scalar():
            group = Group(name=group_name)
            _session.add(group)


def get_id_group_dicts(_session, groups_to_add: List[str]) -> Tuple[Dict[str, int], Dict[int, str]]:
    ids: Dict[str, int] = {}
    ids_to_group: Dict[int, str] = {}
    for group_name in groups_to_add:
        value = _session.query(Group).filter(Group.name == group_name).first()
        i = value.id
        ids[group_name] = i
        ids_to_group[i] = group_name

    return ids, ids_to_group


app, ids = start_app()

try:
    from config import ALLOWED_STEAM_ACCOUNTS
except ImportError:
    ALLOWED_STEAM_ACCOUNTS = []
    users = []


@app.before_request
@with_session
def lookup_current_user(session=None):
    g.user = None
    if 'openid' in flask_session:
        openid = flask_session['openid']
        if len(ALLOWED_STEAM_ACCOUNTS) > 0 and openid not in ALLOWED_STEAM_ACCOUNTS:
            return render_template('login.html')

        g.user = session.query(Player).filter(Player.platformid == openid).first()
        if g.user is None:
            del flask_session['openid']
            return redirect('/')
        g.admin = ids['admin'] in g.user.groups
        g.alpha = ids['alpha'] in g.user.groups
        g.beta = ids['beta'] in g.user.groups
    elif is_local_dev():
        g.user = create_default_player(session=session)
        g.admin = True


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def home(path):
    if path != "" and os.path.exists("webapp/build/" + path):
        return send_from_directory('webapp/build', path)
    else:
        return send_from_directory('webapp/build', 'index.html')


@app.route('/robots.txt')
@app.route('/sitemap.xml')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])


def start_server():
    app.run(host='0.0.0.0', port=8000)

if __name__ == '__main__':
    start_server()

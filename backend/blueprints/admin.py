import json

from flask import Blueprint, current_app, redirect, g, request, url_for, jsonify

from backend.blueprints.shared_renders import render_with_session

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Player, Group
from backend.database.wrapper.stats import global_stats_wrapper
from backend.tasks.celery_tasks import calc_global_stats, calc_global_dists
from backend.utils.checks import is_local_dev

bp = Blueprint('admin', __name__, url_prefix='/admin')


def redirect_url(default='home'):
    """Redirects the person to the previous url they were at, or a default page

    :param default: default url_id to redirect to if we can't find a referer/next
    :return: redirect
    """
    return request.args.get('next') or \
           request.referrer or \
           url_for(default)


@bp.before_request
def check_admin():
    if g.user is None or not g.admin:
        return redirect('/')


@bp.route('/')
@with_session
def home(session=None):
    players = session.query(Player).all()
    groups = session.query(Group).all()
    id_to_groups = {g.id: g.name for g in groups}
    return render_with_session('admin.html', session, players=players, groups=groups, id_to_groups=id_to_groups)


@bp.route('/addrole/<id>/<role>')
@with_session
def addrole(id, role, session=None):
    """Adds a role to a person given an ID and a role id.

    :param id: platformid of the person to add the role to
    :param role: the id of the role
    :return: redirect to the previous url
    """
    role_id = session.query(Group).filter(Group.name == role).first().id
    print(role, role_id)
    player = session.query(Player).filter(Player.platformid == id).first()
    if player is None:
        p = Player(platformid=id, platformname='', avatar='', ranks='', groups=[role_id])
        session.add(p)
    else:
        if role_id not in player.groups:
            player.groups = player.groups + [role_id]
    session.commit()
    return redirect(redirect_url())


@bp.route('/delrole/<id>/<role>')
@with_session
def delrole(id, role, session=None):
    """Removes a role from a person given an ID and a role id.

    :param id: platformid of the person
    :param role: the id of the role
    :return: redirect to the previous url
    """
    role_id = session.query(Group).filter(Group.name == role).first().id
    player = session.query(Player).filter(Player.platformid == id).first()
    if player is None:
        # don't do anything because we don't exist
        pass
    else:
        if role_id in player.groups:
            grps = player.groups.copy()
            grps.remove(role_id)
            player.groups = grps  # we need it to detect that we changed something
    session.commit()
    return redirect(redirect_url())


@bp.route('/users')
@with_session
def view_users(session=None):
    """
    View all users

    :return:
    """
    users = session.query(Player).filter(Player.avatar != '').all()
    groups = session.query(Group).all()
    id_to_groups = {g.id: g.name for g in groups}
    return render_with_session('users.html', session, users=users, groups=groups, id_to_groups=id_to_groups)


@bp.route('/globalstats')
@with_session
def ping(session=None):
    r = current_app.config['r']
    result = r.get('global_stats')
    if result is not None:
        return jsonify({'result': json.loads(result)})
    elif is_local_dev():
        wrapper = global_stats_wrapper.GlobalStatWrapper()
        result = wrapper.get_global_stats(sess=session, with_rank=False)
        return jsonify(result)


@bp.route('/calcdists')
def calc_dists():
    calc_global_dists.delay()
    return jsonify({'result': 'Success'})


@bp.route('/calcstats')
def calc_stats():
    calc_global_stats.delay()
    return jsonify({'result': 'Success'})

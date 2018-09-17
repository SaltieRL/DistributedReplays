import json

from flask import Blueprint, current_app, redirect, g, request, url_for, jsonify

from backend.blueprints.shared_renders import render_with_session
from backend.database.objects import Player, Group
from backend.tasks.celery_tasks import calc_global_stats

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
def home():
    s = current_app.config['db']()
    players = s.query(Player).all()
    groups = s.query(Group).all()
    id_to_groups = {g.id: g.name for g in groups}
    return render_with_session('admin.html', s, players=players, groups=groups, id_to_groups=id_to_groups)


@bp.route('/addrole/<id>/<role>')
def addrole(id, role):
    """Adds a role to a person given an ID and a role id.

    :param id: platformid of the person to add the role to
    :param role: the id of the role
    :return: redirect to the previous url
    """
    s = current_app.config['db']()
    role_id = s.query(Group).filter(Group.name == role).first().id
    print(role, role_id)
    player = s.query(Player).filter(Player.platformid == id).first()
    if player is None:
        p = Player(platformid=id, platformname='', avatar='', ranks='', groups=[role_id])
        s.add(p)
    else:
        if role_id not in player.groups:
            player.groups = player.groups + [role_id]
    s.commit()
    return redirect(redirect_url())


@bp.route('/delrole/<id>/<role>')
def delrole(id, role):
    """Removes a role from a person given an ID and a role id.

    :param id: platformid of the person
    :param role: the id of the role
    :return: redirect to the previous url
    """
    s = current_app.config['db']()
    role_id = s.query(Group).filter(Group.name == role).first().id
    player = s.query(Player).filter(Player.platformid == id).first()
    if player is None:
        # don't do anything because we don't exist
        pass
    else:
        if role_id in player.groups:
            grps = player.groups.copy()
            grps.remove(role_id)
            player.groups = grps  # we need it to detect that we changed something
    s.commit()
    return redirect(redirect_url())


@bp.route('/users')
def view_users():
    """
    View all users

    :return:
    """
    s = current_app.config['db']()
    users = s.query(Player).filter(Player.avatar != '').all()
    groups = s.query(Group).all()
    id_to_groups = {g.id: g.name for g in groups}
    return render_with_session('users.html', s, users=users, groups=groups, id_to_groups=id_to_groups)


@bp.route('/globalstats')
def ping():
    r = current_app.config['r']
    return jsonify({'result': json.loads(r.get('global_stats'))})

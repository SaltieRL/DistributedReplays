from flask import Blueprint, render_template, current_app, redirect, g

from database.objects import Player, Group

bp = Blueprint('admin', __name__, url_prefix='/admin')


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
    return render_template('admin.html', players=players, groups=groups, id_to_groups=id_to_groups)

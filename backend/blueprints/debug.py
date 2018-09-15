from flask import render_template, Blueprint

bp = Blueprint('debug', __name__, url_prefix='/debug')


@bp.route('/colors')
def color_test():
    return render_template('debug/color_test.html')


@bp.route('/field')
def field_mesh():
    return render_template('debug/debug_viewer.html')

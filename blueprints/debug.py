from flask import render_template, Blueprint

bp = Blueprint('debug', __name__, url_prefix='/debug')


@bp.route('/colors')
def color_test():
    return render_template('partials/color_test.html')

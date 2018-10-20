from flask import jsonify, Blueprint

from .errors.errors import CalculatedError

bp = Blueprint('api', __name__, url_prefix='/api/')


@bp.errorhandler(CalculatedError)
def api_handle_error(error: CalculatedError):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

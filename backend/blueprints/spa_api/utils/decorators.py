from flask import g, request
from functools import wraps

from backend.blueprints.spa_api.utils.query_params_handler import create_validation_for_query_params, get_query_params
from ..errors.errors import CalculatedError


def require_user(decorated_function):
    def wrapper_require_user(*args, **kwargs):
        if g.user is None and 'internal_user' not in kwargs:
            raise CalculatedError(404, "User is not logged in.")
        return decorated_function(*args, **kwargs)
    return wrapper_require_user


class with_query_params(object):
    def __init__(self, accepted_query_params=None, provided_params=None):
        if accepted_query_params is None:
            raise Exception("Need query params")
        self.provided_params = provided_params
        self.accepted_query_params = accepted_query_params
        self.validation_func = create_validation_for_query_params(accepted_query_params, self.provided_params)

    def __call__(self, decorated_function):
        @wraps(decorated_function)
        def decorator(*args, **kwargs):
            query_params = get_query_params(self.accepted_query_params, request)
            if query_params is None:
                return decorated_function(*args, **kwargs)
            validation = self.validation_func(query_params)
            if validation is not None:
                return validation
            kwargs['query_params'] = query_params
            return decorated_function(*args, **kwargs)
        return decorator

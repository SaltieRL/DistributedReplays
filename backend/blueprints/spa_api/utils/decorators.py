from flask import g

from ..errors.errors import CalculatedError


def require_user(func):
    def wrapper_require_user(*args, **kwargs):
        if g.user is None:
            raise CalculatedError(404, "User is not logged in.")
        return func(*args, **kwargs)
    return wrapper_require_user

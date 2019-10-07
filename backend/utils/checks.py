from flask import g, current_app


def get_local_dev() -> bool:
    try:
        import config
        try:
            api_key = config.RL_API_KEY
            return False
        except:
            return True
    except ImportError:
        return True


def get_checks(global_state=None):
    def globals():
        if current_app is None:
            return
        if global_state is None:
            return g
        return global_state

    local_dev = get_local_dev()

    def is_admin():
        if local_dev:
            return True
        if current_app is None:
            return False
        if hasattr(globals(), 'user'):
            if globals().user is None:
                return False
            return globals().admin
        return False

    def is_alpha():
        if is_admin():
            return True
        if current_app is None:
            return False
        if hasattr(globals(), 'user'):
            if globals().user is None:
                return False
            return globals().alpha
        return False

    def is_beta():
        if is_admin():
            return True
        if current_app is None:
            return False
        if hasattr(globals(), 'user'):
            if globals().user is None:
                return False
            return is_alpha() or globals().beta
        return False

    return is_admin, is_alpha, is_beta

is_admin, is_alpha, is_beta = get_checks()


IS_LOCAL_DEV = get_local_dev()


def is_local_dev():
    return IS_LOCAL_DEV


def ignore_filtering():
    return False


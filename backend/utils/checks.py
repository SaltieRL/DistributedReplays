import logging

logger = logging.getLogger(__name__)


def get_local_dev() -> bool:
    try:
        import config
        try:
            api_key = config.RL_API_KEY
            return False
        except:
            return True
    except ImportError:
        logger.error('No config exists. Using local dev.')
        return True


def get_checks(global_state):
    local_dev = get_local_dev()

    def is_admin():
        if local_dev:
            return True
        if global_state.user is None:
            return False
        return global_state.admin

    def is_alpha():
        if is_admin():
            return True
        if global_state.user is None:
            return False
        return global_state.alpha

    def is_beta():
        if is_admin():
            return True
        if g.user is None:
            return False
        return is_alpha() or global_state.beta

    return is_admin, is_alpha, is_beta

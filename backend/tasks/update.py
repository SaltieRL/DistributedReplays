import os
import subprocess

from blueprints.spa_api.errors.errors import AuthorizationException
from server_constants import BASE_FOLDER
from utils.checks import is_admin, is_local_dev

try:
    import config
    update_code = config.update_code
    if update_code is None:
        update_code = 1234
except:
    update_code = 1234


def update_self(code):
    if code != update_code or not is_admin():
        raise AuthorizationException()

    script = os.path.join(BASE_FOLDER, 'update_run.sh')
    if update_code == 1234 or is_local_dev():
        subprocess.call([script, 'test'])
    else:
        subprocess.call([script])

import os
"""
File for placement server constants.
Can not depend on any other file in this project only python built ins

"""
SERVER_PERMISSION_GROUPS = ['admin', 'alpha', 'beta']

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'replays')
UPLOAD_RATE_LIMIT_MINUTES = 4.5  # TODO: Make use of this.

from contextlib import contextmanager

from flask import g, appcontext_pushed

from backend.database.objects import Player


@contextmanager
def user_set(app, platform_id):
    def handler(sender, **kwargs):
        g.user = Player(platformid=platform_id, platformname='testuser')
    with appcontext_pushed.connected_to(handler, app):
        yield
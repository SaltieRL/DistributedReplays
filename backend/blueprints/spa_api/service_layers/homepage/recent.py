import json

from sqlalchemy import desc

from backend.blueprints.spa_api.service_layers.replay.replay import CompactReplay
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Game
from backend.database.startup import lazy_get_redis


class RecentReplays:
    def __init__(self, recent):
        self.recent = recent

    @classmethod
    def create(cls):
        recent = cls.get_recent_replays()
        return cls(recent)

    @staticmethod
    @with_session
    def get_recent_replays(session=None):
        r = lazy_get_redis()
        if r is not None and r.get('recent_replays') is not None:
            return json.loads(r.get('recent_replays'))
        replays = session.query(Game).order_by(desc(Game.upload_date))[:5]
        replays = [CompactReplay.create_from_game(r).__dict__ for r in replays]
        if r is not None:
            r.set('recent_replays', json.dumps(replays), ex=60 * 60)
        return replays


if __name__ == '__main__':
    print(RecentReplays.get_recent_replays())

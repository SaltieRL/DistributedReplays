from sqlalchemy import desc

from backend.blueprints.spa_api.service_layers.replay.replay import Replay
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Game


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
        replays = session.query(Game).order_by(desc(Game.match_date))[:5]
        return [Replay.create_from_game(r).__dict__ for r in replays]


if __name__ == '__main__':
    print(RecentReplays.get_recent_replays())

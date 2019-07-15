import json

import requests
from bs4 import BeautifulSoup

from backend.database.startup import lazy_get_redis


class PatreonProgress:
    def __init__(self, progress: str, total: str):
        self.progress = progress
        self.total = total

    @classmethod
    def create(cls):
        progress = cls.get_patreon_progress()
        return cls(progress[0], progress[1])

    @staticmethod
    def get_patreon_progress():
        if lazy_get_redis() is not None:
            r = lazy_get_redis()
            if r.get('patreon_progress'):
                return tuple(json.loads(r.get('patreon_progress')))
        r = requests.get("https://patreon.com/calculated")
        bs = BeautifulSoup(r.text)
        progress = bs.find_all(class_="sc-htpNat ebhhXb")[0].text
        nums = [int(n[1:]) for n in progress.split(' of ')]
        if lazy_get_redis() is not None:
            r = lazy_get_redis()
            r.set('patreon_progress', json.dumps(nums), ex=60 * 60)
        return tuple(nums)


if __name__ == '__main__':
    print(PatreonProgress.get_patreon_progress())

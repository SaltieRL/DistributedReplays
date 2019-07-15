import json
from typing import List

import requests

from backend.database.startup import lazy_get_redis

try:
    import config

    TWITCH_CLIENT_ID = config.TWITCH_CLIENT_ID
except:
    TWITCH_CLIENT_ID = ""

headers = {'Client-ID': TWITCH_CLIENT_ID}


class Stream:

    def __init__(self, name: str, game: str, title: str, viewers: int, thumbnail: str):
        self.name = name
        self.game = game
        self.title = title
        self.viewers = viewers
        self.thumbnail = thumbnail


class TwitchStreams:
    def __init__(self, streams: List[Stream]):
        self.streams = [s.__dict__ for s in streams]

    @classmethod
    def create(cls):
        streams = cls.get_streams()
        objs = []
        for stream in streams:
            objs.append(Stream(stream['user_name'], game='Rocket League', title=stream['title'],
                               viewers=stream['viewer_count'], thumbnail=stream['thumbnail_url']))
        return cls(objs)

    @staticmethod
    def get_size(str_: str, width: int, height: int):
        return str_.replace('{width}', str(width)).replace('{height}', str(height))

    @staticmethod
    def get_id_for_game(name: str):
        r = requests.get("https://api.twitch.tv/helix/games", headers=headers,
                         params={'name': name})
        return r.json()

    @staticmethod
    def get_game(id_: int):
        r = requests.get("https://api.twitch.tv/helix/games", headers=headers,
                         params={'id': id_})
        return r.json()

    @staticmethod
    def get_streams():
        if lazy_get_redis() is not None:
            r = lazy_get_redis()
            if r.get('twitch_streams'):
                return json.loads(r.get('twitch_streams'))
        r = requests.get("https://api.twitch.tv/helix/streams", headers=headers,
                         params={'user_login': ['saucerboy', 'sciguymjm', 'twobackfromtheend', 'RLBotOfficial']}).json()
        if len(r['data']) == 0:
            r = requests.get("https://api.twitch.tv/helix/streams", headers=headers,
                             params={'game_id': '30921'}).json()  # RL streams
            r['data'] = r['data'][:5]
        stream_data = []
        for stream in r['data']:
            stream['thumbnail_url'] = TwitchStreams.get_size(stream['thumbnail_url'], 160, 90)
            stream_data.append(stream)
        if lazy_get_redis() is not None:
            r = lazy_get_redis()
            r.set('twitch_streams', json.dumps(stream_data), ex=60 * 2)
        return stream_data


if __name__ == '__main__':
    print(TwitchStreams.get_streams())
    print(TwitchStreams.get_id_for_game("Rocket League"))
    print(TwitchStreams.get_game(16282))

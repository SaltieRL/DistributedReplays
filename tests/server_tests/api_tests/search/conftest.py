import time

import pytest

from blueprints.spa_api.service_layers.replay.json_tag import JsonTag
from database.wrapper.tag_wrapper import TagWrapper
from tests.utils.database_utils import initialize_db_with_replays, default_player_id
from tests.utils.replay_utils import get_small_replays


@pytest.fixture(scope='package')
def initialize_database_small_replays():
    session, protos, ids = initialize_db_with_replays(get_small_replays())

    class wrapper:
        def get_session(self):
            return session
        def get_protos(self):
            return protos
        def get_ids(self):
            return ids

    return wrapper()


@pytest.fixture(scope='package')
def initialize_database_tags(initialize_database_small_replays):
    session = initialize_database_small_replays.get_session()
    replay_ids = initialize_database_small_replays.get_ids()
    protos = initialize_database_small_replays.get_protos()

    tags = [("tag1", 0, 5, "private_id1"),  # grabs the first 5 replays in the list
            ("tag2", 2, 2, None),  # starts at the 2nd replay and then gets the next 2
            ("tag3", -5, 4, "private_id2"),  # grabs the last 4 replays in the list
            ("tag4", -6, 4, None),  # starts 6 back from the end and grabs 4 replays
            ]

    tagged_games = {}
    for tag in tags:
        tagged_games[tag[0]] = []
        created_tag = JsonTag.create(tag[0], session=session, player_id=default_player_id(), private_id=tag[3])
        game_ids = replay_ids[tag[1]: tag[1] + tag[2]]
        for game_id in game_ids:
            tagged_games[tag[0]].append(game_id)
            TagWrapper.add_tag_to_game(session, game_id, created_tag.db_tag)

    class wrapper:
        def get_session(self):
            return session
        def get_protos(self):
            return protos
        def get_ids(self):
            return replay_ids
        def get_tags(self):
            return tags
        def get_tagged_games(self):
            return tagged_games

    time.sleep(1)
    return wrapper()

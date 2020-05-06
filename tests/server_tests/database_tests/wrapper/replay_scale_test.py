import random
import time
import unittest

from backend.database.objects import Game
from backend.database.startup import lazy_startup_engine

TAGS = ["salt", "pepper", "peppermint", "allspice", "cinnamon", "coriander", "basil", "holy basil", "fennel",
        "cayenne pepper", "horseradish", "ginger", "curry", "celery", "chili", "chili pepper", "dill", "fingerroot",
        "garlic", "lavender", "lemon", "lime", "paprika", "parsley", "rosemary", "thyme", "vanilla", "saffron",
        "sesame", "anise", "tabasco", "wasabi", "spearmint", "watercress", ]


class TagWrapperRemoveTagTest(unittest.TestCase):

    def setUp(self):
        engine, self.sessionmaker = lazy_startup_engine(db='saltietest')
        conn = engine.connect()
        conn.execute("commit")
        try:
            conn.execute('DROP DATABASE IF EXISTS saltietest')
            conn.execute("commit")
        except:
            pass
        self.session = self.sessionmaker()
        # start = time.perf_counter()
        # for i in range(100000):
        #     gm = Game(hash=str(uuid4()), name=str(uuid4()), players=[str(uuid4()) for i in range(6)],
        #               map=random.choice(TAGS), ranks=[0 for i in range(6)], mmrs=[0 for i in range(6)], teamsize=3,
        #               team0score=0, team1score=1,
        #               matchtype=Playlist.RANKED_DUELS, playlist=random.choice([0, 1, 2, 3, 10, 11, 12, 13]),
        #               upload_date=datetime.datetime.now(),
        #               match_date=datetime.datetime.now(), visibility=GameVisibilitySetting.DEFAULT)
        #     self.session.add(gm)
        #     if i % 10000 == 0:
        #         self.session.commit()
        # self.session.commit()
        # end = time.perf_counter()
        # print(f"Rows added in {round(end - start, 2)} seconds.")
        # pass

    def tearDown(self):
        self.session.close()

    def test_time(self):
        session = self.session
        total_games = session.query(Game).count()
        n = 100
        start = time.perf_counter()
        for i in range(n):
            test_game: Game = session.query(Game)[random.randrange(1, total_games)]
            game_obj: Game = session.query(Game).filter(Game.hash == test_game.hash).first()
        end = time.perf_counter()
        print("Average time to access random games:", round((end - start) / n, 3), "seconds")
        pass

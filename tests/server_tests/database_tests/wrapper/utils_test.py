import time

import unittest
from backend.database.objects import Game, PlayerGame, TeamStat
from backend.database.utils.utils import add_objects
from tests.server_tests.utils import get_complex_replay_list, initialize_db_with_replays


class UtilsTest(unittest.TestCase):

    def setUp(self):
        self.session, self.protos, self.guids = initialize_db_with_replays([get_complex_replay_list()[0]])
        self.guid = self.guids[0]
        self.proto = self.protos[0]

    def test_add(self):
        match = self.session.query(PlayerGame).filter(PlayerGame.game == self.guid).first()
        self.assertIsNotNone(match)

    def test_same_upload_date(self):
        match: Game = self.session.query(Game).filter(Game.hash == self.guid).first()
        self.assertIsNotNone(match)

        upload_date = match.upload_date

        time.sleep(1)
        add_objects(self.proto, session=self.session)
        match: Game = self.session.query(Game).filter(Game.hash == self.guid).first()
        self.assertEqual(upload_date, match.upload_date)

    def test_same_ranks(self):
        match: PlayerGame = self.session.query(PlayerGame).filter(PlayerGame.game == self.guid).first()
        self.assertIsNotNone(match)

        rank = match.rank

        time.sleep(1)
        add_objects(self.proto, session=self.session)
        match: PlayerGame = self.session.query(PlayerGame).filter(PlayerGame.game == self.guid).first()
        self.assertEqual(rank, match.rank)

    def tearDown(self):
        playergames = self.session.query(PlayerGame).filter(PlayerGame.game == self.guid).all()
        for obj in playergames:
            self.session.delete(obj)

        teamstats = self.session.query(TeamStat).filter(TeamStat.game == self.guid).all()
        for obj in teamstats:
            self.session.delete(obj)

        games = self.session.query(Game).filter(Game.hash == self.guid).all()
        for obj in games:
            self.session.delete(obj)
        self.session.commit()

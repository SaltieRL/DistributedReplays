from carball import analyze_replay_file
import unittest
import tempfile

from backend.database import startup
from backend.database.objects import Game, PlayerGame, TeamStat
from backend.database.utils.utils import add_objects
from tests.utils import get_complex_replay_list, download_replay_discord


class UtilsTest(unittest.TestCase):

    def setUp(self):
        engine, sessionmaker = startup.startup()
        self.session = sessionmaker()
        _, path = tempfile.mkstemp()
        with open(path, 'wb') as tmp:
            tmp.write(download_replay_discord(get_complex_replay_list()[0]))
        self.replay = analyze_replay_file(path, path + '.json')
        self.proto = self.replay.protobuf_game
        self.guid = self.proto.game_metadata.match_guid

    def test_add(self):
        add_objects(self.proto, session=self.session)
        match = self.session.query(PlayerGame).filter(PlayerGame.game == self.guid).first()
        self.assertIsNotNone(match)

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



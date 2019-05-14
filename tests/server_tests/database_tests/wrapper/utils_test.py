from backend.database.objects import Game, PlayerGame
from backend.database.utils.utils import add_objects
from tests.utils.database_utils import initialize_db_with_replays
from tests.utils.replay_utils import get_complex_replay_list


class Test_Utils:

    def setup_method(self, method):
        self.session, self.protos, self.guids = initialize_db_with_replays([get_complex_replay_list()[0]])
        self.guid = self.guids[0]
        self.proto = self.protos[0]

    def test_add(self):
        match = self.session.query(PlayerGame).filter(PlayerGame.game == self.guid).first()
        assert(match is not None)

    def test_same_upload_date(self):
        match: Game = self.session.query(Game).filter(Game.hash == self.guid).first()
        assert(match is not None)

        upload_date = match.upload_date

        add_objects(self.proto, session=self.session)
        match: Game = self.session.query(Game).filter(Game.hash == self.guid).first()
        assert(upload_date == match.upload_date)

    def test_same_ranks(self):
        match: PlayerGame = self.session.query(PlayerGame).filter(PlayerGame.game == self.guid).first()
        assert(match is not None)

        rank = match.rank

        add_objects(self.proto, session=self.session)
        match: PlayerGame = self.session.query(PlayerGame).filter(PlayerGame.game == self.guid).first()
        assert(rank == match.rank)

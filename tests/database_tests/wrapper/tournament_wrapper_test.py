import unittest

from flask import current_app

from backend.blueprints.spa_api.errors.errors import UserNotAuthorizedError, UserNotAuthenticatedError
from backend.database.objects import Player, Tournament
from backend.database.wrapper.tournament_wrapper import TournamentWrapper

TEST_USER_ID = "00000000000000001"
TEST_GAME_ID = "TEST_REPLAY"
TEST_TOURNAMENT_NAME = "TEST_TOURNAMENT"


# TODO move this to a utils file
def add_test_user(session):
    test_user = session.query(Player).filter(Player.platformid == TEST_USER_ID).first()
    if test_user is None:
        test_user = Player(platformid=TEST_USER_ID)
        session.add(test_user)
        session.commit()


# TODO move this to a utils file
def remove_test_user(session):
    test_user = session.query(Player).filter(Player.platformid == TEST_USER_ID).first()
    if test_user is not None:
        session.delete(test_user)
        session.commit()


def remove_test_tournament(session, tournament_id):
    test_tournament = session.query(Tournament).filter(Tournament.id == tournament_id).first()
    if test_tournament is not None:
        session.delete(test_tournament)
        session.commit()


class CreateTournamentTest(unittest.TestCase):
    def setUp(self):
        self.test_user_id = TEST_USER_ID
        self.session = current_app.config["db"]()
        add_test_user(self.session)

    def tearDown(self):
        remove_test_user(self.session)
        remove_test_tournament(self.session, self.tournament_id)
        self.session.close()

    def test_create_tournament(self):
        tournament = TournamentWrapper.add_tournament(self.session, TEST_USER_ID, TEST_TOURNAMENT_NAME)
        self.tournament_id = tournament.id


class DeleteTournamentTest(unittest.TestCase):
    def setUp(self):
        self.test_user_id = TEST_USER_ID
        self.session = current_app.config["db"]()
        tournament = TournamentWrapper.add_tournament(self.session, TEST_USER_ID, TEST_TOURNAMENT_NAME)
        self.tournament_id = tournament.id
        add_test_user(self.session)

    def tearDown(self):
        remove_test_user(self.session)
        remove_test_tournament(self.session, self.tournament_id)
        self.session.close()

    def test_remove_tournament(self):
        TournamentWrapper.remove_tournament(self.session, tournament_id=self.tournament_id, sender=self.test_user_id)


class RenameTournamentTest(unittest.TestCase):
    pass


class AddTournamentStageTest(unittest.TestCase):
    pass


class DeleteTournamentStageTest(unittest.TestCase):
    pass


class AddTournamentSeriesTest(unittest.TestCase):
    pass


class DeleteTournamentSeriesTest(unittest.TestCase):
    pass


class TournamentPermissionTest(unittest.TestCase):
    pass


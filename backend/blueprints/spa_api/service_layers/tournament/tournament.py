from typing import List

from flask import current_app, g

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.blueprints.spa_api.service_layers.player.player import Player
from backend.blueprints.spa_api.service_layers.tournament.tournament_stage import TournamentStage
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Player as DBPlayer, Tournament as DBTournament
from backend.database.wrapper.tournament_wrapper import TournamentWrapper


class Tournament:
    def __init__(self, id_: int, owner: str, name: str, participants: List[Player], stages: List[TournamentStage],
                 admins: List[Player]):
        self.id = id_
        self.owner = owner
        self.name = name
        self.participants = [player.__dict__ for player in participants]
        self.stages = [stage.__dict__ for stage in stages]
        if (g.user is not None and g.user.platformid is owner) or g.admin:
            self.admins = [admin.__dict__ for admin in admins]

    @staticmethod
    @with_session
    def create_from_id(tournament_id: int, session=None) -> 'Tournament':
        tournament: DBTournament = TournamentWrapper.get_tournament(session, tournament_id)
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        return Tournament.create_from_db_object(tournament)

    @staticmethod
    def create_from_db_object(tournament: DBTournament) -> 'Tournament':
        return Tournament(tournament.id, tournament.owner, tournament.name,
                          [Player.create_from_id(player.platformid) for player in tournament.participants],
                          [TournamentStage.create_from_db_object(stage) for stage in tournament.stages],
                          [Player.create_from_id(admin.platformid) for admin in tournament.admins])

    @staticmethod
    @with_session
    def get_players_tournaments(platform_id: str, session=None) -> 'List[Tournament]':
        player: DBPlayer = session.query(DBPlayer).filter(DBPlayer.platformid == platform_id).first()
        if player is None:
            session.close()
            raise CalculatedError(404, "Player does not exist.")
        return [Tournament.create_from_db_object(tournament) for tournament in player.owned_tournaments]

    @staticmethod
    @with_session
    def create(name: str, session=None) -> 'Tournament':
        tournament_db, session = TournamentWrapper.add_tournament(session, g.user.platformid, name)
        result = Tournament.create_from_db_object(tournament_db)
        session.close()
        return result

    @staticmethod
    @with_session
    def rename(new_name: str, tournament_id: int, session=None) -> 'Tournament':
        tournament = TournamentWrapper.rename_tournament(session, new_name, tournament_id=tournament_id,
                                                         sender=g.user.platformid)
        return Tournament.create_from_db_object(tournament)

    @staticmethod
    @with_session
    def delete(tournament_id: int, session=None):
        TournamentWrapper.remove_tournament(session, tournament_id=tournament_id, sender=g.user.platformid)

    @staticmethod
    @with_session
    def add_admin(tournament_id: int, platformid: str, session=None):
        TournamentWrapper.add_tournament_admin(session, admin_platformid=platformid, tournament_id=tournament_id,
                                               sender=g.user.platformid)

    @staticmethod
    @with_session
    def remove_admin(tournament_id: int, platformid: str, session=None):
        TournamentWrapper.remove_tournament_admin(session, admin_platformid=platformid, tournament_id=tournament_id,
                                                  sender=g.user.platformid)

    @staticmethod
    @with_session
    def add_participant(tournament_id: int, platformid: str, session=None):
        TournamentWrapper.add_tournament_participant(session, participant_platformid=platformid,
                                                     tournament_id=tournament_id, sender=g.user.platformid)

    @staticmethod
    @with_session
    def remove_participant(tournament_id: int, platformid: str, session=None):
        TournamentWrapper.remove_tournament_participant(session, participant_platformid=platformid,
                                                        tournament_id=tournament_id, sender=g.user.platformid)

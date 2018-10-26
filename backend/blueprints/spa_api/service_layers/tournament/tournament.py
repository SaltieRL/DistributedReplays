from typing import List

from flask import current_app, g

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.blueprints.spa_api.service_layers.player.player import Player
from backend.blueprints.spa_api.service_layers.tournament.tournament_stage import TournamentStage
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Player as DBPlayer, Tournament as DBTournament
from backend.database.wrapper.tournament_wrapper import TournamentWrapper, TournamentPermissions


class Tournament:
    def __init__(self, id_: int, owner: str, name: str, participants: List[str], stages: List[TournamentStage],
                 admins: List[str]):
        self.id = id_
        self.owner = owner
        self.name = name
        self.participants = participants
        self.stages = [stage.__dict__ for stage in stages]
        if g.user is not None:
            session = current_app.config['db']()
            try:
                if TournamentWrapper.has_permission(session, id_, g.user.platformid,
                                                    TournamentPermissions.TOURNAMENT_OWNER):
                    self.admins = admins
            finally:
                session.close

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
                          [player.platformid for player in tournament.participants],
                          [TournamentStage.create_from_db_object(stage) for stage in tournament.stages],
                          [admin.platformid for admin in tournament.admins])

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
        tournament_db = TournamentWrapper.add_tournament(session, g.user.platformid, name)
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
        return Player.create_from_id(platformid)

    @staticmethod
    @with_session
    def remove_admin(tournament_id: int, platformid: str, session=None):
        TournamentWrapper.remove_tournament_admin(session, admin_platformid=platformid, tournament_id=tournament_id,
                                                  sender=g.user.platformid)

    @staticmethod
    @with_session
    def get_admins(tournament_id, session=None):
        if TournamentWrapper.has_permission(session, tournament_id, g.user.platformid,
                                            TournamentPermissions.TOURNAMENT_OWNER):
            tournament = TournamentWrapper.get_tournament(session, tournament_id=tournament_id)
            return [Player.create_from_id(player.platformid) for player in tournament.admins]
        else:
            raise CalculatedError(403, "User not authorized.")

    @staticmethod
    @with_session
    def add_participant(tournament_id: int, platformid: str, session=None):
        TournamentWrapper.add_tournament_participant(session, participant_platformid=platformid,
                                                     tournament_id=tournament_id, sender=g.user.platformid)
        return Player.create_from_id(platformid)

    @staticmethod
    @with_session
    def remove_participant(tournament_id: int, platformid: str, session=None):
        TournamentWrapper.remove_tournament_participant(session, participant_platformid=platformid,
                                                        tournament_id=tournament_id, sender=g.user.platformid)

    @staticmethod
    @with_session
    def get_participants(tournament_id, session=None):
        tournament = TournamentWrapper.get_tournament(session, tournament_id=tournament_id)
        return [Player.create_from_id(player.platformid) for player in tournament.participants]

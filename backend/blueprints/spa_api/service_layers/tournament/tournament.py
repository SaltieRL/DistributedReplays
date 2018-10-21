from typing import List

from flask import current_app, g

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.blueprints.spa_api.service_layers.player.player import Player
from backend.blueprints.spa_api.service_layers.tournament.tournament_stage import TournamentStage
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
    def create_from_id(tournament_id: int) -> 'Tournament':
        session = current_app.config['db']()
        tournament: DBTournament = session.query(DBTournament).filter(DBTournament.id == tournament_id).one()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        session.close()
        return Tournament.create_from_db_object(tournament)

    @staticmethod
    def create_from_db_object(tournament: DBTournament) -> 'Tournament':
        return Tournament(tournament.id, tournament.owner, tournament.name,
                          [Player.create_from_id(player.platformid) for player in tournament.participants],
                          [TournamentStage.create_from_db_object(stage) for stage in tournament.stages],
                          [Player.create_from_id(admin.platformid) for admin in tournament.admins])

    @staticmethod
    def get_players_tournaments(platform_id: str) -> 'List[Tournament]':
        session = current_app.config['db']()
        player: DBPlayer = session.query(DBPlayer).filter(DBPlayer.platformid == platform_id).one()
        session.close()
        return [Tournament.create_from_db_object(tournament) for tournament in player.owned_tournaments]

    @staticmethod
    def create(name: str) -> 'Tournament':
        return Tournament.create_from_db_object(TournamentWrapper.add_tournament(g.user.platformid, name))

    @staticmethod
    def rename(new_name: str, tournament_id: int) -> 'Tournament':
        tournament = TournamentWrapper.rename_tournament(new_name, tournament_id=tournament_id,
                                                         sender=g.user.platformid)
        return Tournament.create_from_db_object(tournament)

    @staticmethod
    def delete(tournament_id: int):
        TournamentWrapper.remove_tournament(tournament_id=tournament_id, sender=g.user.platformid)

    @staticmethod
    def add_admin(tournament_id: int, platformid: str):
        TournamentWrapper.add_tournament_admin(admin_platformid=platformid, tournament_id=tournament_id,
                                               sender=g.user.platformid)

    @staticmethod
    def remove_admin(tournament_id: int, platformid: str):
        TournamentWrapper.remove_tournament_admin(admin_platformid=platformid, tournament_id=tournament_id,
                                                  sender=g.user.platformid)

    @staticmethod
    def add_participant(tournament_id: int, platformid: str):
        TournamentWrapper.add_tournament_participant(participant_platformid=platformid, tournament_id=tournament_id,
                                                     sender=g.user.platformid)

    @staticmethod
    def remove_participant(tournament_id: int, platformid: str):
        TournamentWrapper.remove_tournament_participant(participant_platformid=platformid, tournament_id=tournament_id,
                                                        sender=g.user.platformid)

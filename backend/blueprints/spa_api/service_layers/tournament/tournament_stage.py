from typing import List

from flask import g

from backend.blueprints.spa_api.errors.errors import CalculatedError, StageNotFound
from backend.blueprints.spa_api.service_layers.tournament.tournament_series import TournamentSeries
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import TournamentStage as DBStage
from backend.database.wrapper.tournament_wrapper import TournamentWrapper


class TournamentStage:
    def __init__(self, id_: int, tournament_id: int, name: str, serieses: List[TournamentSeries]):
        self.id = id_
        self.tournamentId = tournament_id
        self.name = name
        self.serieses = [series.__dict__ for series in serieses]

    @staticmethod
    @with_session
    def create_from_id(stage_id: int, session=None) -> 'TournamentStage':
        stage: DBStage = TournamentWrapper.get_stage(session, stage_id)
        if stage is None:
            raise StageNotFound
        return TournamentStage.create_from_db_object(stage)

    @staticmethod
    def create_from_db_object(db_stage: DBStage) -> 'TournamentStage':
        return TournamentStage(db_stage.id, db_stage.tournament_id, db_stage.name,
                               [TournamentSeries.create_from_db_object(series) for series in db_stage.serieses])

    @staticmethod
    @with_session
    def create(name: str, tournament_id: int, session=None) -> 'TournamentStage':
        return TournamentStage.create_from_db_object(
            TournamentWrapper.add_tournament_stage(session, name, tournament_id=tournament_id, sender=g.user.platformid))

    @staticmethod
    @with_session
    def rename(new_name: str, stage_id: int, session=None) -> 'TournamentStage':
        tournament = TournamentWrapper.rename_tournament_stage(session, new_name, stage_id=stage_id,
                                                               sender=g.user.platformid)
        return TournamentStage.create_from_db_object(tournament)

    @staticmethod
    @with_session
    def delete(stage_id: int, session=None):
        TournamentWrapper.remove_tournament_stage(session, stage_id=stage_id, sender=g.user.platformid)

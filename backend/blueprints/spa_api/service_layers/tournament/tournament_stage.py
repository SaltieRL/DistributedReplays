from typing import List

from flask import current_app, g

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.blueprints.spa_api.service_layers.tournament.tournament_series import TournamentSeries
from backend.database.objects import TournamentStage as DBStage
from backend.database.wrapper.tournament_wrapper import TournamentWrapper


class TournamentStage:
    def __init__(self, id_: int, tournament_id: int, name: str, serieses: List[TournamentSeries]):
        self.id = id_
        self.tournamentId = tournament_id
        self.name = name
        self.serieses = [series.__dict__ for series in serieses]

    @staticmethod
    def create_from_id(stage_id: int) -> 'TournamentStage':
        session = current_app.config['db']()
        stage: DBStage = session.query(DBStage).filter(DBStage.id == stage_id).one()
        if stage is None:
            raise CalculatedError(404, "Stage not found.")
        session.close()
        return TournamentStage.create_from_db_object(stage)

    @staticmethod
    def create_from_db_object(db_stage: DBStage) -> 'TournamentStage':
        return TournamentStage(db_stage.id, db_stage.tournament_id, db_stage.name,
                               [TournamentSeries.create_from_db_object(series) for series in db_stage.serieses])

    @staticmethod
    def create(name: str, tournament_id: int) -> 'TournamentStage':
        return TournamentStage.create_from_db_object(
            TournamentWrapper.add_tournament_stage(name, tournament_id=tournament_id, sender=g.user.platformid))

    @staticmethod
    def rename(new_name: str, stage_id: int) -> 'TournamentStage':
        tournament = TournamentWrapper.rename_tournament_stage(new_name, stage_id=stage_id, sender=g.user.platformid)
        return TournamentStage.create_from_db_object(tournament)

    @staticmethod
    def delete(stage_id: int):
        TournamentWrapper.remove_tournament_stage(stage_id=stage_id, sender=g.user.platformid)

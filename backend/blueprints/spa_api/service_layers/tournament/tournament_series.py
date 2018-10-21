from typing import List

from flask import current_app, g

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.blueprints.spa_api.service_layers.replay.replay import Replay
from backend.database.objects import TournamentSeries as DBSeries
from backend.database.wrapper.tournament_wrapper import TournamentWrapper


class TournamentSeries:
    def __init__(self, id_: int, stage_id: int, name: str, replays: List[Replay]):
        self.id = id_
        self.stageId = stage_id
        self.name = name
        self.replays = [replay.__dict__ for replay in replays]

    @staticmethod
    def create_from_id(stage_id: int) -> 'TournamentSeries':
        session = current_app.config['db']()
        series: DBSeries = session.query(DBSeries).filter(DBSeries.id == stage_id).one()
        if series is None:
            raise CalculatedError(404, "Series not found.")
        session.close()
        return TournamentSeries.create_from_db_object(series)

    @staticmethod
    def create_from_db_object(db_series: DBSeries) -> 'TournamentSeries':
        return TournamentSeries(db_series.id, db_series.stage_id, db_series.name,
                                [Replay.create_from_game(game) for game in db_series.games])

    @staticmethod
    def create(name: str, stage_id: int) -> 'TournamentSeries':
        return TournamentSeries.create_from_db_object(
            TournamentWrapper.add_tournament_stage(name, stage_id=stage_id, sender=g.user.platformid))

    @staticmethod
    def rename(new_name: str, series_id: int) -> 'TournamentSeries':
        tournament = TournamentWrapper.rename_series(new_name, series_id=series_id, sender=g.user.platformid)
        return TournamentSeries.create_from_db_object(tournament)

    @staticmethod
    def delete(series_id: int):
        TournamentWrapper.remove_tournament_stage(series_id=series_id, sender=g.user.platformid)

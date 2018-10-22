from typing import List

from flask import current_app, g

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.blueprints.spa_api.service_layers.replay.replay import Replay
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import TournamentSeries as DBSeries
from backend.database.wrapper.tournament_wrapper import TournamentWrapper


class TournamentSeries:
    def __init__(self, id_: int, stage_id: int, name: str, replays: List[Replay]):
        self.id = id_
        self.stageId = stage_id
        self.name = name
        self.replays = [replay.__dict__ for replay in replays]

    @staticmethod
    @with_session
    def create_from_id(series_id: int, session=None) -> 'TournamentSeries':
        series: DBSeries = TournamentWrapper.get_series(session, series_id)
        if series is None:
            raise CalculatedError(404, "Series not found.")
        return TournamentSeries.create_from_db_object(series)

    @staticmethod
    def create_from_db_object(db_series: DBSeries) -> 'TournamentSeries':
        return TournamentSeries(db_series.id, db_series.stage_id, db_series.name,
                                [Replay.create_from_game(game) for game in db_series.games])

    @staticmethod
    @with_session
    def create(name: str, stage_id: int, session=None) -> 'TournamentSeries':
        return TournamentSeries.create_from_db_object(
            TournamentWrapper.add_series_to_stage(session, name, stage_id=stage_id, sender=g.user.platformid))

    @staticmethod
    @with_session
    def rename(new_name: str, series_id: int, session=None) -> 'TournamentSeries':
        tournament = TournamentWrapper.rename_series(session, new_name, series_id=series_id, sender=g.user.platformid)
        return TournamentSeries.create_from_db_object(tournament)

    @staticmethod
    @with_session
    def delete(series_id: int, session=None):
        TournamentWrapper.remove_series(session, series_id=series_id, sender=g.user.platformid)

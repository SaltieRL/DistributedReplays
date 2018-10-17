import datetime

from flask import current_app
from sqlalchemy import func

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.database.objects import Game, TournamentPlayer, TournamentSeries, SeriesGame, PlayerGame, TournamentStage, \
    Tournament

DEFAULT_SERIES_NAME = "Unknown Series"
DEFAULT_STAGE_NAME = "Unknown Stage"


class TournamentWrapper:
    @staticmethod
    def add_tournament(owner, name):
        session = current_app.config['db']()
        tournament = session.query(Tournament).filter(Tournament.owner == owner, Tournament.name == name).first()
        if tournament is not None:
            raise CalculatedError(400, "User already has a tournament with that name.")
        tournament = Tournament(owner=owner, name=name)
        session.add(tournament)
        session.commit()
        session.close()
        return tournament

    @staticmethod
    def remove_tournament(tournament_id):
        session = current_app.config['db']()
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).one()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        session.delete(tournament)
        session.commit()
        session.close()
        pass

    @staticmethod
    def rename_tournament(tournament_id, new_name):
        session = current_app.config['db']()
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).one()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        tournament.name = new_name
        session.commit()
        session.close()
        pass

    @staticmethod
    def get_tournament(tournament_id, session=None):
        passed_session = session is not None
        if not passed_session:
            session = current_app.config['db']()
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).one()
        if not passed_session:
            session.close()
        return tournament

    @staticmethod
    def add_tournament_stage(tournament_id, stage_name):
        pass  # TODO return new stage

    @staticmethod
    def remove_tournament_stage(tournament_id, stage_name):
        pass

    @staticmethod
    def add_series_to_stage(stage_id, series_name):
        pass  # TODO return new series

    @staticmethod
    def remove_series_from_stage(stage_id, series_name):
        pass

    @staticmethod
    def add_game_to_series(game_hash, series_id):
        pass

    @staticmethod
    def remove_game_from_series(game_hash, series_id):
        pass

    @staticmethod
    def start_auto_tournament_adding(game_hash):
        session = current_app.config['db']()
        game = session.query(Game).filter(Game.hash == game_hash).scalar()

        unmatched_players_tolerance = 1  # TODO make this configurable
        tournaments = session.query(TournamentPlayer, func.count(TournamentPlayer.tournament_id)).\
            filter(TournamentPlayer.player_id.in_(game.players)).\
            group_by(TournamentPlayer.tournament_id).\
            having(func.count(TournamentPlayer.tournament_id) >= game.teamsize * 2 - unmatched_players_tolerance).all()

        if len(tournaments) is 0:
            return  # no matching tournaments found

        tournament_ids = [player.tournament_id for player, count in tournaments]
        serieses = session.query(TournamentStage, TournamentSeries).\
            filter(TournamentStage.tournament_id.in_(tournament_ids)).\
            join(TournamentSeries).\
            join(SeriesGame).\
            join(PlayerGame, PlayerGame.game == SeriesGame.game_hash).\
            filter(PlayerGame.player.in_(game.players)).\
            group_by(SeriesGame.series_id, SeriesGame.game_hash).\
            having(func.count(SeriesGame.series_id, SeriesGame.game_hash)
                   >= game.teamsize * 2 - unmatched_players_tolerance).all()

        for tourney_player, matched_count in tournaments:
            time_between_matches = datetime.timedelta(minutes=15)  # TODO make this tournament specific
            # find matching series
            series: TournamentSeries = None
            for tournament_stage, tournament_series in serieses:
                if tournament_stage.tournament_id is tourney_player.tournament_id:
                    series = tournament_series
                    matched = False
                    for series_game in series.games:
                        if series_game.match_date - game.match_date <= time_between_matches:
                            matched = True
                            break
                    if matched:
                        break
                    else:
                        series = None
            if series is None:  # create new series because we could not match the game with an existing one
                # try to find first stage
                stage = session.query(TournamentStage).\
                    filter(TournamentStage.tournament_id == tourney_player.tournament_id).first()
                if stage is None:
                    stage = TournamentWrapper.add_tournament_stage(tourney_player.tournament_id, DEFAULT_STAGE_NAME)

                series = TournamentWrapper.add_series_to_stage(stage.id, DEFAULT_SERIES_NAME)

            TournamentWrapper.add_game_to_series(game.hash, series.id)

            # if matched_count < game.teamsize * 2:
                # pass
            # TODO mark SeriesGame with review needed
        # no need to commit anything here
        session.close()

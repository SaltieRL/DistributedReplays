import datetime
import enum

from flask import current_app
from sqlalchemy import func

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.database.objects import Game, TournamentPlayer, TournamentSeries, SeriesGame, PlayerGame, TournamentStage,\
    Tournament, Player

DEFAULT_SERIES_NAME = "Unknown Series"
DEFAULT_STAGE_NAME = "Unknown Stage"


class TournamentPermissions(enum.Enum):
    SITE_ADMIN = 0
    TOURNAMENT_OWNER = 1
    TOURNAMENT_ADMIN = 2


def require_permission(permission_level=TournamentPermissions.SITE_ADMIN):
    def perm_arg_wrapper(decorated_function):
        def permission_wrapper(*args, **kwargs):
            sender = kwargs['sender']
            if sender is None:
                raise CalculatedError(400, 'Permission denied. User not authenticated.')

            tournament_id = kwargs['tournament_id']
            stage_id = kwargs['stage_id']
            series_id = kwargs['series_id']

            session = current_app.config['db']()
            if series_id is not None:
                series: TournamentSeries = session.query(TournamentSeries).filter(TournamentSeries.id == series_id).one()
                stage_id = series.stage_id

            if stage_id is not None:
                stage: TournamentStage = session.query(TournamentStage).filter(TournamentStage.id == stage_id).one()
                tournament_id = stage.tournament_id

            tournament = session.query(Tournament).filter(Tournament.id == tournament_id).one()

            if tournament_id is None or tournament is None:
                session.close()
                raise CalculatedError(400, 'Cannot find tournament.')

            is_site_admin = False # TODO implement site admin permissions
            is_owner = sender is tournament.owner
            is_tournament_admin = False

            # if the sender is the owner, we can skip going through admins
            if not is_owner:
                for admin in tournament.admins:
                    if admin.platformid is sender:
                        is_tournament_admin = True
                        break

            session.close()

            if permission_level is TournamentPermissions.SITE_ADMIN and is_site_admin:
                return decorated_function(args, kwargs)
            elif permission_level is TournamentPermissions.TOURNAMENT_OWNER and (is_owner or is_site_admin):
                return decorated_function(args, kwargs)
            elif permission_level is TournamentPermissions.TOURNAMENT_ADMIN and (is_owner or is_site_admin or
                                                                                 is_tournament_admin):
                return decorated_function(args, kwargs)
            else:
                raise CalculatedError(400, 'User not authorized.')
        return permission_wrapper
    return perm_arg_wrapper


class TournamentWrapper:
    @staticmethod
    # no permissions required here
    def add_tournament(owner, name):
        session = current_app.config['db']()
        tournament = session.query(Tournament).filter(Tournament.owner == owner, Tournament.name == name).first()
        if tournament is not None:
            # we could also ignore that if we want to use ids anyway
            raise CalculatedError(400, "User already has a tournament with that name.")
        tournament = Tournament(owner=owner, name=name)
        session.add(tournament)
        session.commit()
        session.close()
        return tournament

    @staticmethod
    @require_permission(TournamentPermissions.SITE_ADMIN)
    def remove_tournament(tournament_id=None, sender=None):
        # better hide this from users, you do not really need to delete tournaments
        session = current_app.config['db']()
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).one()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        session.delete(tournament)
        session.commit()
        session.close()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def rename_tournament(new_name, tournament_id=None, sender=None):
        session = current_app.config['db']()
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).one()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        tournament.name = new_name
        session.commit()
        session.close()

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
    @require_permission(TournamentPermissions.TOURNAMENT_OWNER)
    def add_tournament_admin(admin_platformid, tournament_id=None, sender=None):
        session = current_app.config['db']()
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).one()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        player = session.query(Player).filter(Player.platformid == admin_platformid).one()
        if tournament is None:
            raise CalculatedError(404, "Player not found.")
        tournament.admins.append(player)
        session.commit()
        session.close()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_OWNER)
    def add_tournament_admin(admin_platformid, tournament_id=None, sender=None):
        session = current_app.config['db']()
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).one()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        player = session.query(Player).filter(Player.platformid == admin_platformid).one()
        if tournament is None:
            raise CalculatedError(404, "Player not found.")
        tournament.admins.remove(player)
        session.commit()
        session.close()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def add_tournament_stage(stage_name, tournament_id=None, sender=None):
        session = current_app.config['db']()
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).one()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        stage = TournamentStage(tournament_id=tournament_id, name=stage_name)
        session.add(stage)
        session.commit()
        session.close()
        return stage

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def remove_tournament_stage(stage_id=None, sender=None):
        session = current_app.config['db']()
        stage = session.query(TournamentStage).filter(TournamentStage.id == stage_id).one()
        if stage is None:
            raise CalculatedError(404, "Stage not found.")
        session.delete(stage)
        session.commit()
        session.close()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def rename_tournament_stage(new_name, stage_id=None, sender=None):
        session = current_app.config['db']()
        stage = session.query(TournamentStage).filter(TournamentStage.id == stage_id).one()
        if stage is None:
            raise CalculatedError(404, "Stage not found.")
        stage.name = new_name
        session.commit()
        session.close()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def add_series_to_stage(series_name, stage_id=None, sender=None):
        session = current_app.config['db']()
        stage = session.query(TournamentStage).filter(TournamentStage.id == stage_id).one()
        if stage is None:
            raise CalculatedError(404, "Stage not found.")
        series = TournamentSeries(name=series_name, stage_id=stage_id)
        session.add(series)
        session.commit()
        session.close()
        return series

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def remove_series(series_id=None, sender=None):
        session = current_app.config['db']()
        series = session.query(TournamentSeries).filter(TournamentSeries.id == series_id).one()
        if series is None:
            raise CalculatedError(404, "Stage not found.")
        session.delete(series)
        session.commit()
        session.close()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def rename_series(new_name, series_id=None, sender=None):
        session = current_app.config['db']()
        series = session.query(TournamentSeries).filter(TournamentSeries.id == series_id).one()
        if series is None:
            raise CalculatedError(404, "Stage not found.")
        series.name = new_name
        session.commit()
        session.close()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def add_game_to_series(game_hash, series_id=None, sender=None):
        session = current_app.config['db']()
        series = session.query(TournamentSeries).filter(TournamentSeries.id == series_id).one()
        if series is None:
            raise CalculatedError(404, "Stage not found.")
        game = session.query(Game).filter(Game.hash == game_hash)
        if game is None:
            raise CalculatedError(404, "Game not found.")
        series.games.append(game)
        session.commit()
        session.close()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def remove_game_from_series(game_hash, series_id=None, sender=None):
        session = current_app.config['db']()
        series = session.query(TournamentSeries).filter(TournamentSeries.id == series_id).one()
        if series is None:
            raise CalculatedError(404, "Stage not found.")
        game = session.query(Game).filter(Game.hash == game_hash)
        if game is None:
            raise CalculatedError(404, "Game not found.")
        series.games.remove(game)
        session.commit()
        session.close()

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

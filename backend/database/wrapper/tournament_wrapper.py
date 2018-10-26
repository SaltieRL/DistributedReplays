import datetime
import enum

from flask import current_app, g
from sqlalchemy import func

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.database.objects import Game, TournamentPlayer, TournamentSeries, SeriesGame, PlayerGame, TournamentStage,\
     Tournament, Player, TournamentSeriesStatus
from backend.utils.checks import get_checks

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
                raise CalculatedError(401, 'User not authenticated.')

            tournament_id = None
            stage_id = None
            series_id = None

            if 'tournament_id' in kwargs:
                tournament_id = kwargs['tournament_id']
            if 'stage_id' in kwargs:
                stage_id = kwargs['stage_id']
            if 'series_id' in kwargs:
                series_id = kwargs['series_id']

            session = current_app.config['db']()
            if series_id is not None:
                series: TournamentSeries = session.query(TournamentSeries).filter(TournamentSeries.id == series_id).one()
                stage_id = series.stage_id

            if stage_id is not None:
                stage: TournamentStage = session.query(TournamentStage).filter(TournamentStage.id == stage_id).one()
                tournament_id = stage.tournament_id

            if TournamentWrapper.has_permission(session, tournament_id, sender, permission_level):
                session.close()
                return decorated_function(*args, **kwargs)
            else:
                session.close()
                raise CalculatedError(403, 'User not authorized.')
        return permission_wrapper
    return perm_arg_wrapper


class TournamentWrapper:
    @staticmethod
    # no permissions required here
    def add_tournament(session, owner, name):
        tournament = Tournament(owner=owner, name=name)
        session.add(tournament)
        session.commit()
        return tournament

    @staticmethod
    @require_permission(TournamentPermissions.SITE_ADMIN)
    def remove_tournament(session, tournament_id=None, sender=None):
        # better hide this from users, you do not really need to delete tournaments
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).first()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        session.delete(tournament)
        session.commit()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def rename_tournament(session, new_name, tournament_id=None, sender=None):
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).first()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        tournament.name = new_name
        session.commit()
        return tournament

    @staticmethod
    def get_tournament(session, tournament_id):
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).first()
        return tournament

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_OWNER)
    def add_tournament_admin(session, admin_platformid, tournament_id=None, sender=None):
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).first()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        player = session.query(Player).filter(Player.platformid == admin_platformid).first()
        if tournament is None:
            raise CalculatedError(404, "Player not found.")  # TODO add player to DB instead
        tournament.admins.append(player)
        session.commit()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_OWNER)
    def remove_tournament_admin(session, admin_platformid, tournament_id=None, sender=None):
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).first()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        player = session.query(Player).filter(Player.platformid == admin_platformid).first()
        if tournament is None:
            raise CalculatedError(404, "Player not found.")
        if player in tournament.admins:
            tournament.admins.remove(player)
            session.commit()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def add_tournament_participant(session, participant_platformid, tournament_id=None, sender=None):
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).first()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        player = session.query(Player).filter(Player.platformid == participant_platformid).first()
        if tournament is None:
            raise CalculatedError(404, "Player not found.")  # TODO add player to DB instead
        tournament.participants.append(player)
        session.commit()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def remove_tournament_participant(session, participant_platformid, tournament_id=None, sender=None):
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).first()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        player = session.query(Player).filter(Player.platformid == participant_platformid).first()
        if tournament is None:
            raise CalculatedError(404, "Player not found.")
        if player in tournament.participants:
            tournament.participants.remove(player)
            session.commit()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def add_tournament_stage(session, stage_name, tournament_id=None, sender=None):
        tournament = session.query(Tournament).filter(Tournament.id == tournament_id).first()
        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")
        stage = TournamentStage(tournament_id=tournament_id, name=stage_name)
        session.add(stage)
        session.commit()
        return stage

    @staticmethod
    def get_stage(session, stage_id):
        stage = session.query(TournamentStage).filter(TournamentStage.id == stage_id).first()
        return stage

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def remove_tournament_stage(session, stage_id=None, sender=None):
        stage = session.query(TournamentStage).filter(TournamentStage.id == stage_id).first()
        if stage is None:
            raise CalculatedError(404, "Stage not found.")
        session.delete(stage)
        session.commit()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def rename_tournament_stage(session, new_name, stage_id=None, sender=None):
        stage = session.query(TournamentStage).filter(TournamentStage.id == stage_id).first()
        if stage is None:
            raise CalculatedError(404, "Stage not found.")
        stage.name = new_name
        session.commit()
        return stage

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def add_series_to_stage(session, series_name, stage_id=None, sender=None):
        stage = session.query(TournamentStage).filter(TournamentStage.id == stage_id).first()
        if stage is None:
            raise CalculatedError(404, "Stage not found.")
        series = TournamentSeries(name=series_name, stage_id=stage_id)
        session.add(series)
        session.commit()
        return series

    @staticmethod
    def get_series(session, series_id):
        series = session.query(TournamentSeries).filter(TournamentSeries.id == series_id).first()
        return series

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def remove_series(session, series_id=None, sender=None):
        series = session.query(TournamentSeries).filter(TournamentSeries.id == series_id).first()
        if series is None:
            raise CalculatedError(404, "Stage not found.")
        session.delete(series)
        session.close()

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def rename_series(session, new_name, series_id=None, sender=None):
        series = session.query(TournamentSeries).filter(TournamentSeries.id == series_id).first()
        if series is None:
            raise CalculatedError(404, "Stage not found.")
        series.name = new_name
        session.commit()
        return series

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def add_game_to_series(session, game_hash, series_id=None, sender=None):
        series: TournamentSeries = session.query(TournamentSeries).filter(TournamentSeries.id == series_id).first()
        if series is None:
            raise CalculatedError(404, "Stage not found.")
        game = session.query(Game).filter(Game.hash == game_hash).first()
        if game is None:
            raise CalculatedError(404, "Game not found.")
        series.games.append(game)
        for player in game.players:
            if player not in series.stage.tournament.participants:
                series.stage.tournament.participants.append(player)
        session.commit()
        return game

    @staticmethod
    @require_permission(TournamentPermissions.TOURNAMENT_ADMIN)
    def remove_game_from_series(session, game_hash, series_id=None, sender=None):
        series = session.query(TournamentSeries).filter(TournamentSeries.id == series_id).first()
        if series is None:
            raise CalculatedError(404, "Stage not found.")
        game = session.query(Game).filter(Game.hash == game_hash).first()
        if game is None:
            raise CalculatedError(404, "Game not found.")
        if game in series.games:
            series.games.remove(game)
        session.commit()

    @staticmethod
    def has_permission(session, tournament_id: int, platform_id: str, permission_level: TournamentPermissions):
        tournament = None
        if tournament_id is not None:
            tournament = session.query(Tournament).filter(Tournament.id == tournament_id).first()

        if tournament is None:
            raise CalculatedError(404, "Tournament not found.")  # TODO create a sub class for that error

        is_admin_check, is_alpha_check, is_beta_check = get_checks(g)
        is_site_admin = is_admin_check()
        is_owner = platform_id == tournament.owner
        is_tournament_admin = False

        # if the sender is the owner or site admin, we can skip going through admins
        if not is_site_admin and not is_owner:
            for admin in tournament.admins:
                if admin.platformid == platform_id:
                    is_tournament_admin = True
                    break

        return (permission_level is TournamentPermissions.SITE_ADMIN and is_site_admin) \
               or (permission_level is TournamentPermissions.TOURNAMENT_OWNER and (is_owner or is_site_admin)) \
               or (permission_level is TournamentPermissions.TOURNAMENT_ADMIN and (is_owner or is_site_admin or
                                                                                   is_tournament_admin))

    @staticmethod
    def start_auto_tournament_adding(session, game_hash):
        game = session.query(Game).filter(Game.hash == game_hash).first()
        if game is None:
            raise CalculatedError(404, "Game not found.")

        unmatched_players_tolerance = 0
        if game.teamsize > 1:
            unmatched_players_tolerance = 1
        # TODO make this configurable but for now 1s should not have any tolerance
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
                        series_game_finished = series_game.match_date + \
                                               datetime.timedelta(seconds=round(series_game.length))
                        if abs(series_game_finished - game.match_date) <= time_between_matches:
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
                    stage = TournamentWrapper.add_tournament_stage(session, tourney_player.tournament_id,
                                                                   DEFAULT_STAGE_NAME)

                series = TournamentWrapper.add_series_to_stage(session, stage.id, DEFAULT_SERIES_NAME)

            TournamentWrapper.add_game_to_series(session, game.hash, series.id)

            if matched_count < game.teamsize * 2:
                series.status = TournamentSeriesStatus.REVIEW_NEEDED
                session.commit()

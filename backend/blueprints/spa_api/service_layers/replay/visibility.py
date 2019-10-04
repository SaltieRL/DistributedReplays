import time
from datetime import datetime

from flask import g

from backend.blueprints.spa_api.errors.errors import PlayerNotFound, ReplayNotFound, AuthorizationException, \
    CalculatedError
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Player, GameVisibility, Game, Playlist
from backend.blueprints.spa_api.utils.decorators import require_user
from backend.database.objects import GameVisibilitySetting
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.utils.logging import ErrorLogger


class ReplayVisibility:
    def __init__(self, id_: str, visibility: GameVisibilitySetting):
        self.id = id_
        self.visibility = visibility.value

    @staticmethod
    @require_user
    def change_replay_visibility(game_hash: str,
                                 visibility: GameVisibilitySetting,
                                 user_id='',
                                 release_date=None) -> 'ReplayVisibility':
        can_change = PlayerWrapper.have_permission_to_change_game(game_hash, user_id)
        if can_change:
            try:
                apply_game_visibility_explicit(user_id, visibility, release_date, game_hash)
            except CalculatedError as e:
                ErrorLogger.log_error(e)
                raise e
        else:
            ErrorLogger.log_error(AuthorizationException())

        return ReplayVisibility(game_hash, visibility)


def apply_game_visibility(query_params=None, game_id=None, game_exists=True,
                          proto_game=None) -> Exception:

    # if it is a custom lobby we should try and fake it being a private game so scrims are not published.
    if (not game_exists and proto_game is not None and proto_game.game_metadata.playlist == Playlist.CUSTOM_LOBBY
            and query_params is not None and 'player_id' in query_params):
        query_params = {'player_id': query_params['player_id'],
                        'visibility': GameVisibilitySetting.PRIVATE}

    if query_params is None:
        return None
    if 'visibility' not in query_params:
        return None

    player_id = query_params['player_id']
    visibility = query_params['visibility']
    try:
        release_date = query_params['release_date']
    except KeyError:
        release_date = None

    try:
        can_change = PlayerWrapper.have_permission_to_change_game(game_id, player_id)
    except ReplayNotFound:
        can_change = not game_exists

    if can_change:
        return apply_game_visibility_explicit(player_id, visibility, release_date, game_id)
    raise AuthorizationException()


@with_session
def apply_game_visibility_explicit(player_id, visibility: GameVisibilitySetting,
                                   release_date: datetime, game_id, session=None, retry=False):
    entry = session.query(GameVisibility).filter(GameVisibility.player == player_id,
                                                 GameVisibility.game == game_id).first()
    if entry is not None and entry.visibility != visibility:
        entry.visibility = visibility
        session.commit()
        return update_game_visibility(game_id, session, visibility)

    player = session.query(Player).filter(Player.platformid == player_id).first()
    if player is not None:
        game_visibility_entry = GameVisibility(game=game_id, player=player_id, visibility=visibility)
        if release_date is not None:
            game_visibility_entry.release_date = release_date

        update_game_visibility(game_id, session, visibility)

        session.add(game_visibility_entry)
        # GameVisibility fails silently - does not do anything if player_id does not exist.
        session.commit()

        return None
    elif not retry:
        time.sleep(1)
        return apply_game_visibility_explicit(player_id, visibility, release_date,
                                              game_id=game_id, session=session, retry=True)

    raise PlayerNotFound()


def update_game_visibility(game_id, session, visibility: GameVisibilitySetting, retry=False):
    game = session.query(Game).filter(Game.hash == game_id).first()
    if game is None:
        if not retry:
            time.sleep(1)
            return update_game_visibility(game_id=game_id, session=session, visibility=visibility, retry=True)
        raise ReplayNotFound()

    if game.visibility == visibility:
        return

    game.visibility = visibility
    session.commit()
    return

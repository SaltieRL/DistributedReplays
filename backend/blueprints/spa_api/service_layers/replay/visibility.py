import time
from datetime import datetime

from flask import g

from backend.blueprints.spa_api.errors.errors import PlayerNotFound, ReplayNotFound
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Player, GameVisibility, Game
from backend.blueprints.spa_api.utils.decorators import require_user
from backend.database.objects import GameVisibilitySetting
from backend.database.wrapper.player_wrapper import PlayerWrapper
from backend.utils.checks import log_error


class ReplayVisibility:
    def __init__(self, id_: str, visibility: GameVisibilitySetting):
        self.id = id_
        self.visibility = visibility.value

    @staticmethod
    @require_user
    def change_replay_visibility(game_hash: str,
                                 visibility: GameVisibilitySetting,
                                 release_date=None) -> 'ReplayVisibility':
        can_change = PlayerWrapper.have_permission_to_change_game(game_hash)
        if can_change:
            result = apply_game_visibility_explicit(g.user.platformid, visibility, release_date, game_hash)
            if result is not None:
                log_error(result)
                raise result

        return ReplayVisibility(game_hash, visibility)


def apply_game_visibility(query_params=None, game_id=None) -> Exception:
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
    return apply_game_visibility_explicit(player_id, visibility, release_date, game_id)


@with_session
def apply_game_visibility_explicit(player_id, visibility: GameVisibilitySetting,
                                   release_date: datetime, game_id, session=None, retry=False) -> Exception:
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

        result = update_game_visibility(game_id, session, visibility)
        if result is not None:
            return result

        session.add(game_visibility_entry)
        # GameVisibility fails silently - does not do anything if player_id does not exist.
        session.commit()

        return None
    elif not retry:
        time.sleep(1)
        return apply_game_visibility_explicit(player_id, visibility, release_date,
                                              game_id=game_id, session=session, retry=True)

    return PlayerNotFound()


def update_game_visibility(game_id, session, visibility: GameVisibilitySetting, retry=False) -> Exception:
    game = session.query(Game).filter(Game.hash == game_id).first()
    if game is None:
        if not retry:
            time.sleep(1)
            return update_game_visibility(game_id=game_id, session=session, visibility=visibility, retry=True)
        return ReplayNotFound()

    if game.visibility == visibility:
        return None

    game.visibility = visibility
    session.commit()
    return None

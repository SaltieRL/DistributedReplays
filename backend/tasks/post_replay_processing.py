import time

from backend.blueprints.spa_api.errors.errors import PlayerNotFound, ReplayNotFound
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Player, GameVisibility, Game


@with_session
def apply_game_visibility(query_params=None, game_id=None, session=None, retry=False) -> Exception:
    if query_params is None:
        return None
    if 'visibility' not in query_params:
        return None

    player_id = query_params['player_id']
    visibility = query_params['visibility']
    release_date = query_params['release_date']

    player = session.query(Player).filter(Player.platformid == player_id).first()
    if player is not None:
        game_visibility_entry = GameVisibility(game=game_id, player=player_id, visibility=visibility)
        if release_date is not None:
            game_visibility_entry.release_date = release_date
        session.add(game_visibility_entry)
        # GameVisibility fails silently - does not do anything if player_id does not exist.
        session.commit()

        return update_game_visibility(game_id, session, visibility)

    elif not retry:
        time.sleep(1)
        return apply_game_visibility(query_params=query_params, game_id=game_id, session=session, retry=True)

    return PlayerNotFound()


def update_game_visibility(game_id, session, visibility, retry=False) -> Exception:
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

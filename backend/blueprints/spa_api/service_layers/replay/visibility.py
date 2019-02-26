from backend.blueprints.spa_api.utils.decorators import require_user
from backend.database.objects import GameVisibilitySetting
from backend.database.wrapper.player_wrapper import PlayerWrapper


@require_user
def change_replay_visibility(game_hash: str, visibility: GameVisibilitySetting) -> GameVisibilitySetting:
    updated_visibility_setting = PlayerWrapper.change_game_visibility(game_hash, visibility)
    return updated_visibility_setting


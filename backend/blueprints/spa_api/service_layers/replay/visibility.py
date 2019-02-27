from backend.blueprints.spa_api.utils.decorators import require_user
from backend.database.objects import GameVisibilitySetting
from backend.database.wrapper.player_wrapper import PlayerWrapper


class ReplayVisibility:
    def __init__(self, id_: str, visibility: GameVisibilitySetting):
        self.id = id_
        self.visibility = visibility.value

    @staticmethod
    @require_user
    def change_replay_visibility(game_hash: str, visibility: GameVisibilitySetting) -> 'ReplayVisibility':
        updated_visibility_setting = PlayerWrapper.change_game_visibility(game_hash, visibility)

        return ReplayVisibility(game_hash, updated_visibility_setting)

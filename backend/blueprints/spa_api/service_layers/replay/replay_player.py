from backend.database.objects import PlayerGame
from backend.utils.psyonix_api_handler import get_item_name_by_id


class Loadout:
    def __init__(self, car: str):
        self.car = car

    @staticmethod
    def create_from_player_game(player_game: PlayerGame):
        return Loadout(
            car=get_item_name_by_id(str(player_game.car))
        )


class CameraSettings:
    def __init__(self, distance: int, field_of_view: int, transition_speed: float,
                 pitch: int, swivel_speed: int, stiffness: float,
                 height: int):
        self.distance = distance
        self.fieldOfView = field_of_view
        self.transitionSpeed = transition_speed
        self.pitch = pitch
        self.swivelSpeed = swivel_speed
        self.stiffness = stiffness
        self.height = height

    @staticmethod
    def create_from_player_game(player_game: PlayerGame):
        return CameraSettings(
            distance=player_game.distance,
            field_of_view=player_game.field_of_view,
            transition_speed=player_game.transition_speed,
            pitch=player_game.pitch,
            swivel_speed=player_game.swivel_speed,
            stiffness=player_game.stiffness,
            height=player_game.height
        )


class ReplayPlayer:
    def __init__(self, id_: str, name: str, is_orange: bool,
                 score: int, goals: int, assists: int, saves: int, shots: int,
                 camera_settings: CameraSettings, loadout: Loadout):
        self.id = id_
        self.name = name
        self.isOrange = is_orange
        self.score = score
        self.goals = goals
        self.assists = assists
        self.saves = saves
        self.shots = shots
        self.cameraSettings = camera_settings.__dict__
        self.loadout = loadout.__dict__

    @staticmethod
    def create_from_player_game(player_game: PlayerGame) -> 'ReplayPlayer':
        return ReplayPlayer(
            id_=player_game.player,
            name=player_game.name,
            is_orange=player_game.is_orange,
            score=player_game.score,
            goals=player_game.goals,
            assists=player_game.assists,
            saves=player_game.saves,
            shots=player_game.shots,
            camera_settings=CameraSettings.create_from_player_game(player_game),
            loadout=Loadout.create_from_player_game(player_game)
        )

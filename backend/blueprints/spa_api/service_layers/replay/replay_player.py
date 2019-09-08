from backend.database.objects import PlayerGame
from backend.utils.rlgarage_handler import RLGarageAPI


class LoadoutItem:
    def __init__(self, item_name: str, image_url: str, paint_id: int):
        self.itemName = item_name
        self.imageUrl = image_url
        self.paintId = paint_id

    @staticmethod
    def create_from_item_id(id_: int, paint_id: int, api: RLGarageAPI):
        if id_ == 0:
            return LoadoutItem("None", "", 0)
        try:
            item = api.get_item_info(id_, paint_id)
        except Exception as e:
            print("Error with loadout", e)
            return LoadoutItem("Unknown", "", 0)
        return LoadoutItem(item['name'], item['image'], paint_id)


class Loadout:
    def __init__(self, antenna: LoadoutItem, banner: LoadoutItem, boost: LoadoutItem, car: LoadoutItem,
                 engine_audio: LoadoutItem, goal_explosion: LoadoutItem,
                 skin: LoadoutItem, topper: LoadoutItem, trail: LoadoutItem, wheels):
        self.antenna = antenna.__dict__
        self.banner = banner.__dict__
        self.boost = boost.__dict__
        self.car = car.__dict__
        self.engine_audio = engine_audio.__dict__
        self.goal_explosion = goal_explosion.__dict__
        self.skin = skin.__dict__
        self.topper = topper.__dict__
        self.trail = trail.__dict__
        self.wheels = wheels.__dict__

    @staticmethod
    def create_from_player_game(player_game: PlayerGame):
        api = RLGarageAPI()
        item_list = [
            'antenna', 'banner', 'boost', 'car', 'engine_audio', 'goal_explosion', 'skin', 'topper', 'trail',
            'wheels'
        ]
        no_paint = [
            "engine_audio"
        ]
        if len(player_game.loadout) > 0:
            loadout = player_game.loadout[0]
            item_info = {
                item: LoadoutItem.create_from_item_id(getattr(loadout, item),
                                                      getattr(loadout, item + "_paint") if item not in no_paint else 0,
                                                      api)
                for item in item_list
            }
        else:
            item_info = {item: LoadoutItem.create_from_item_id(0, 0, api) for item in
                         item_list}

        return Loadout(
            **item_info
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

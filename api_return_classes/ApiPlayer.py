from .ApiPlayerCameraSettings import ApiPlayerCameraSettings
from .ApiPlayerLoadout import ApiPlayerLoadout


# noinspection PyPep8Naming
class ApiPlayer:

    def __init__(self, id: int = None, name: str = None, steamProfile: str = None,
                 titleId: int = None,
                 matchScore: int = None,
                 matchGoals: int = None,
                 matchAssists: int = None,
                 matchSaves: int = None,
                 matchShots: int = None,
                 cameraSettings: ApiPlayerCameraSettings = None,
                 loadout: ApiPlayerLoadout = None,
                 isOrange: bool = None
                 ):
        self.id = id
        self.name = name
        self.steamProfile = steamProfile
        self.titleId = titleId
        self.matchScore = matchScore
        self.matchGoals = matchGoals
        self.matchAssists = matchAssists
        self.matchSaves = matchSaves
        self.matchShots = matchShots
        self.cameraSettings = cameraSettings
        self.loadout = loadout
        self.isOrange = isOrange

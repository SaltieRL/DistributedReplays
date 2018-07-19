# noinspection PyPep8Naming
class ApiPlayerCameraSettings:

    def __init__(self, stiffness: float = None, height: float = None, transitionSpeed: float = None,
                 pitch: float = None, swivelSpeed: float = None, fieldOfView: float = None, distance: float = None):
        self.stiffness = stiffness
        self.height = height
        self.transitionSpeed = transitionSpeed
        self.pitch = pitch
        self.swivelSpeed = swivelSpeed
        self.fieldOfView = fieldOfView
        self.distance = distance

# noinspection PyPep8Naming
class ApiPlayerLoadout:

    def __init__(self, banner: int = None, car: int = None, goalExplosion: int = None,
                 skin: int = None, trail: int = None, wheels: int = None):
        self.banner = banner
        self.car = car
        self.goalExplosion = goalExplosion
        self.skin = skin
        self.trail = trail
        self.wheels = wheels

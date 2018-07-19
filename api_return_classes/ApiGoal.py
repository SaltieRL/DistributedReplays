from .ApiPlayer import ApiPlayer


class ApiGoal:
    def __init__(self, player: ApiPlayer = None, frame: int = None):
        self.player = player
        self.frame = frame

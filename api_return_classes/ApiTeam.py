from typing import List

from .ApiPlayer import ApiPlayer


# noinspection PyPep8Naming
class ApiTeam:

    def __init__(self, name: str = None, players: List[ApiPlayer] = None,
                 score: int = None, isOrange: bool = None
                 ):
        self.name = name
        self.players = players
        self.score = score
        self.isOrange = isOrange

from typing import Optional


class CalculatedError(Exception):
    status_code: int
    message: str

    def __init__(self, status_code: Optional[int] = None, message: Optional[str] = None):
        if status_code is not None:
            self.status_code = status_code
        if message is not None:
            self.message = message

    def to_dict(self):
        return {
            "message": self.message
        }


class UserHasNoReplays(CalculatedError):
    status_code = 404
    message = "This user has no replays."


class ReplayNotFound(CalculatedError):
    status_code = 404
    message = "This replay does not exist."

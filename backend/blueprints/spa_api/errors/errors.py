class CalculatedError(Exception):
    status_code: int
    message: str

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

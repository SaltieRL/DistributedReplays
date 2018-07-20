import json


class BaseApiReturnClass:
    def to_json(self) -> str:
        return json.dumps(self)

from typing import Dict, List

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Settings


class SettingsHandler:
    def __init__(self, settings: List):
        self.settings = settings

    @classmethod
    @with_session
    def create_from_id(cls, id_, session=None):
        result = session.query(Settings).filter(Settings.user == id_).all()
        return SettingsHandler([
            {
                "key": row.key,
                "value": row.value
            } for row in result])

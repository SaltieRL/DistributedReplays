from typing import List

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

    @staticmethod
    @with_session
    def get_setting(user_id: str, name: str, create_if_not_exists=False, default_value=None, session=None):
        """
        Gets the setting value for this user.

        :param user_id: User to retrieve setting for
        :param name: Name of the setting
        :param create_if_not_exists: Create this setting with `default_value` if it doesn't exist
        :param default_value: Default value to return if the setting does not exist.
        :param session: session (automatically populated if not set)
        :return: setting value
        """
        result = session.query(Settings).filter(Settings.user == user_id).filter(Settings.key == name).first()
        if result is None:
            if create_if_not_exists:
                setting = Settings.create(name, default_value, user_id)
                session.add(setting)
                session.commit()
            return default_value
        return result.value

    @staticmethod
    @with_session
    def set(user_id: str, settings: dict, session=None):
        for key in settings:
            result: Settings = session.query(Settings).filter(Settings.user == user_id).filter(
                Settings.key == key).first()
            if result is not None:
                result.value = settings[key]
        session.commit()

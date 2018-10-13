from backend.database.objects import Tag
from backend.database.wrapper.tag_wrapper import TagWrapper


class GameTag:
    def __init__(self, name: str, owner: str):
        self.name = name
        self.ownerId = owner

    @staticmethod
    def create_from_tag(tag: Tag):
        return GameTag(tag.name, tag.owner)

    @staticmethod
    def add_tag(replay_id: str, user_id: str, tag_name):
        TagWrapper.add_tag_to_game(replay_id, user_id, tag_name)

    @staticmethod
    def remove_tag(replay_id: str, user_id, tag_name):
        """
        :return: None if tag is not found
        """
        return TagWrapper.remove_tag_from_game(replay_id, user_id, tag_name)

from typing import List

from flask import g, current_app

from ...errors.errors import CalculatedError
from backend.database.objects import Tag as DBTag
from backend.database.wrapper.tag_wrapper import TagWrapper


class Tag:
    def __init__(self, name: str, owner: str):
        self.name = name
        self.ownerId = owner

    @staticmethod
    def create_from_dbtag(tag: DBTag):
        return Tag(tag.name, tag.owner)

    @staticmethod
    def create(name: str) -> 'Tag':
        session = current_app.config['db']()

        # Check if tag exists
        tag = TagWrapper.get_tag(g.user.platformid, name, session)
        if tag is not None:
            session.close()
            return tag

        dbtag = TagWrapper.create_tag(session, g.user.platformid, name)
        tag = Tag.create_from_dbtag(dbtag)
        session.close()
        return tag

    @staticmethod
    def rename(current_name: str, new_name: str) -> 'Tag':
        session = current_app.config['db']()

        # Check if tag exists
        tag = TagWrapper.get_tag(g.user.platformid, new_name, session)
        if tag is not None:
            session.close()
            raise CalculatedError(409, "Name is already taken.")

        dbtag = TagWrapper.rename_tag(session, g.user.platformid, current_name, new_name)
        tag = Tag.create_from_dbtag(dbtag)
        session.close()
        return tag

    @staticmethod
    def delete(name: str) -> None:
        TagWrapper.delete_tag(g.user.platformid, name)

    @staticmethod
    def get_all() -> List['Tag']:
        session = current_app.config['db']()
        dbtags = TagWrapper.get_tags(session, g.user.platformid)
        tags = [Tag.create_from_dbtag(dbtag) for dbtag in dbtags]
        session.close()
        return tags

    @staticmethod
    def add_tag_to_game(name: str, replay_id: str) -> None:
        TagWrapper.add_tag_to_game(replay_id, g.user.platformid, name)

    @staticmethod
    def remove_tag_from_game(name: str, replay_id: str) -> None:
        TagWrapper.remove_tag_from_game(replay_id, g.user.platformid, name)

from typing import List

from flask import g, current_app

from ...errors.errors import CalculatedError, TagNotFound
from backend.database.objects import Tag as DBTag
from backend.database.wrapper.tag_wrapper import TagWrapper, DBTagNotFound


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
        try:
            dbtag = TagWrapper.get_tag(g.user.platformid, name, session)
            tag = Tag.create_from_dbtag(dbtag)
            session.close()
            return tag
        except DBTagNotFound:
            pass
        dbtag = TagWrapper.create_tag(session, g.user.platformid, name)
        tag = Tag.create_from_dbtag(dbtag)
        session.close()
        return tag

    @staticmethod
    def rename(current_name: str, new_name: str) -> 'Tag':
        session = current_app.config['db']()

        # Check if name already exists
        try:
            TagWrapper.get_tag(g.user.platformid, new_name, session)
            session.close()
            raise CalculatedError(409, f"Tag with name {new_name} already exists.")
        except DBTagNotFound:
            pass

        try:
            dbtag = TagWrapper.rename_tag(session, g.user.platformid, current_name, new_name)
        except DBTagNotFound:
            session.close()
            raise TagNotFound()
        tag = Tag.create_from_dbtag(dbtag)
        session.close()
        return tag

    @staticmethod
    def delete(name: str) -> None:
        try:
            TagWrapper.delete_tag(g.user.platformid, name)
        except DBTagNotFound:
            raise TagNotFound()

    @staticmethod
    def get_all() -> List['Tag']:
        session = current_app.config['db']()
        dbtags = TagWrapper.get_tags(session, g.user.platformid)
        tags = [Tag.create_from_dbtag(dbtag) for dbtag in dbtags]
        session.close()
        return tags

    @staticmethod
    def add_tag_to_game(name: str, replay_id: str) -> None:
        try:
            TagWrapper.add_tag_to_game(replay_id, g.user.platformid, name)
        except DBTagNotFound:
            raise TagNotFound()

    @staticmethod
    def remove_tag_from_game(name: str, replay_id: str) -> None:
        try:
            TagWrapper.remove_tag_from_game(replay_id, g.user.platformid, name)
        except DBTagNotFound:
            raise TagNotFound()

from typing import List

from flask import g

from backend.blueprints.spa_api.service_layers.utils import with_session
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
    @with_session
    def create(name: str, session=None) -> 'Tag':
        # Check if tag exists
        try:
            dbtag = TagWrapper.get_tag(session, g.user.platformid, name)
            tag = Tag.create_from_dbtag(dbtag)
            return tag
        except DBTagNotFound:
            pass
        dbtag = TagWrapper.create_tag(session, g.user.platformid, name)
        tag = Tag.create_from_dbtag(dbtag)
        return tag

    @staticmethod
    @with_session
    def rename(current_name: str, new_name: str, session=None) -> 'Tag':
        # Check if name already exists
        try:
            TagWrapper.get_tag(session, g.user.platformid, new_name)
            raise CalculatedError(409, f"Tag with name {new_name} already exists.")
        except DBTagNotFound:
            pass

        try:
            dbtag = TagWrapper.rename_tag(session, g.user.platformid, current_name, new_name)
        except DBTagNotFound:
            raise TagNotFound()
        tag = Tag.create_from_dbtag(dbtag)
        return tag

    @staticmethod
    @with_session
    def delete(name: str, session=None) -> None:
        try:
            TagWrapper.delete_tag(session, g.user.platformid, name)
        except DBTagNotFound:
            raise TagNotFound()

    @staticmethod
    @with_session
    def get_all(session=None) -> List['Tag']:
        dbtags = TagWrapper.get_tags(session, g.user.platformid)
        tags = [Tag.create_from_dbtag(dbtag) for dbtag in dbtags]
        return tags

    @staticmethod
    @with_session
    def add_tag_to_game(name: str, replay_id: str, session=None) -> None:
        try:
            TagWrapper.add_tag_to_game(session, replay_id, g.user.platformid, name)
        except DBTagNotFound:
            raise TagNotFound()

    @staticmethod
    @with_session
    def remove_tag_from_game(name: str, replay_id: str, session=None) -> None:
        try:
            TagWrapper.remove_tag_from_game(session, replay_id, g.user.platformid, name)
        except DBTagNotFound:
            raise TagNotFound()

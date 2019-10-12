import base64
import urllib
from typing import List, Dict

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.blueprints.spa_api.errors.errors import TagNotFound, TagError, TagKeyError
from backend.database.objects import Tag as DBTag
from backend.database.wrapper.tag_wrapper import TagWrapper, DBTagNotFound
from backend.utils.safe_flask_globals import get_current_user_id


class Tag:
    def __init__(self, name: str, owner: str, privateKey: str = None, db_tag: DBTag = None):
        super().__init__()
        self.name = name
        self.ownerId = owner
        self.privateKey = privateKey
        self.db_tag = db_tag

    def to_JSON(self, with_id=False):
        if with_id:
            return {
                "name": self.name,
                "ownerId": self.ownerId,
                "privateKey": self.privateKey,
                "tag_id": self.db_tag.id
            }

        return {
            "name": self.name,
            "ownerId": self.ownerId,
            "privateKey": self.privateKey,
        }

    @staticmethod
    def create_from_dbtag(tag: DBTag):
        private_key = None if tag.private_id is None else Tag.encode_tag(tag.id, tag.private_id)
        return Tag(tag.name, tag.owner, privateKey=private_key, db_tag=tag)

    @staticmethod
    @with_session
    def add_private_key(name: str, private_key: str, session=None, player_id=None):
        try:
            TagWrapper.add_private_key_to_tag(session, get_current_user_id(player_id=player_id), name, private_key)
        except DBTagNotFound:
            raise TagNotFound()

    @staticmethod
    @with_session
    def create(name: str, session=None, player_id=None, private_id=None) -> 'Tag':
        """
        Creates a new instance of Tag, add one to the db if it does not exist.
        :param name: Tag name
        :param session: Database session
        :param player_id
        :param private_id
        :return:
        """
        # Check if tag exists
        try:
            dbtag = TagWrapper.get_tag_by_name(session, get_current_user_id(player_id=player_id), name)
            tag = Tag.create_from_dbtag(dbtag)
            return tag
        except DBTagNotFound:
            pass
        dbtag = TagWrapper.create_tag(session, get_current_user_id(player_id=player_id), name, private_id=private_id)
        tag = Tag.create_from_dbtag(dbtag)
        return tag

    @staticmethod
    @with_session
    def rename(current_name: str, new_name: str, session=None) -> 'Tag':
        # Check if name already exists
        try:
            TagWrapper.get_tag_by_name(session, get_current_user_id(), new_name)
            raise TagError(409, f"Tag with name {new_name} already exists.")
        except DBTagNotFound:
            pass

        try:
            dbtag = TagWrapper.rename_tag(session, get_current_user_id(), current_name, new_name)
        except DBTagNotFound:
            raise TagNotFound()
        tag = Tag.create_from_dbtag(dbtag)
        return tag

    @staticmethod
    @with_session
    def delete(name: str, session=None) -> None:
        try:
            TagWrapper.delete_tag(session, get_current_user_id(), name)
        except DBTagNotFound:
            raise TagNotFound()

    @staticmethod
    @with_session
    def get_all(session=None) -> List['Tag']:
        dbtags = TagWrapper.get_tags(session, get_current_user_id())
        tags = [Tag.create_from_dbtag(dbtag) for dbtag in dbtags]
        return tags

    @staticmethod
    @with_session
    def get_tag(name: str, session=None) -> 'Tag':
        dbtag = TagWrapper.get_tag_by_name(session, get_current_user_id(), name)
        return Tag.create_from_dbtag(dbtag)

    @staticmethod
    @with_session
    def add_tag_to_game(name: str, replay_id: str, session=None) -> None:
        try:
            TagWrapper.add_tag_by_name_to_game(session, replay_id, get_current_user_id(), name)
        except DBTagNotFound:
            raise TagNotFound()

    @staticmethod
    @with_session
    def remove_tag_from_game(name: str, replay_id: str, session=None) -> None:
        try:
            TagWrapper.remove_tag_from_game(session, replay_id, get_current_user_id(), name)
        except DBTagNotFound:
            raise TagNotFound()

    @staticmethod
    @with_session
    def get_encoded_private_key(name: str, session=None) -> str:
        tag = Tag.get_tag(name, session=session)
        if tag.db_tag.private_id is None:
            raise TagNotFound()
        return Tag.encode_tag(tag.db_tag.id, tag.db_tag.private_id)

    @staticmethod
    def encode_tag(tag_id: int, private_id: str) -> str:
        merged = str(tag_id + 1000) + ":" + private_id
        # b85 encodes it to make it smaller / unreadable followed by a url encode to make it friendly for urls.
        return urllib.parse.quote(base64.b85encode(merged.encode(encoding="utf-8")).decode('utf-8'))

    @staticmethod
    def decode_tag(encoded_key: str):
        decoded_key_bytes = base64.b85decode(urllib.parse.unquote(encoded_key).encode('utf-8'))

        try:
            decoded_key = decoded_key_bytes.decode(encoding="utf-8")
        except UnicodeDecodeError as e:
            raise TagKeyError(encoded_key, e)

        first_index = decoded_key.find(':')
        tag_id = int(decoded_key[0: first_index]) - 1000
        decoded_private_id = decoded_key[first_index + 1:]
        return tag_id, decoded_private_id


@with_session
def apply_tags_to_game(query_params: Dict[str, any] = None, game_id=None, session=None):
    if query_params is None:
        return None

    private_ids = query_params['private_tag_keys'] if 'private_tag_keys' in query_params else []

    for private_id in private_ids:
        tag_id, private_key = Tag.decode_tag(private_id)
        tag = TagWrapper.get_tag_by_id(session, tag_id)
        if tag.private_id is not None and tag.private_id == private_key:
            TagWrapper.add_tag_to_game(session, game_id, tag)

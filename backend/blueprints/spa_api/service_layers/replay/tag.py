from typing import List, Dict

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.utils.global_functions import get_current_user_id
from backend.utils.checks import log_error
from ...errors.errors import CalculatedError, TagNotFound, PlayerNotFound
from backend.database.objects import Tag as DBTag, Player
from backend.database.wrapper.tag_wrapper import TagWrapper, DBTagNotFound

class Tag:
    def __init__(self, name: str, owner: str, db_tag: DBTag = None):
        super().__init__()
        self.name = name
        self.owner_id = owner
        self.db_tag = db_tag

    def toJSON(self, with_id=None):
        if with_id:
            return {
                "name": self.name,
                "owner_id": self.owner_id,
                "tag_id": self.db_tag.id
            }

        return {
            "name": self.name,
            "owner_id": self.owner_id
        }

    @staticmethod
    def create_from_dbtag(tag: DBTag):
        return Tag(tag.name, tag.owner, db_tag=tag)

    @staticmethod
    @with_session
    def create(name: str, session=None, player_id=None, private_key=None) -> 'Tag':
        """
        Creates a new instance of Tag, add one to the db if it does not exist.
        :param name: Tag name
        :param session: Database session
        :param player_id
        :return:
        """
        # Check if tag exists
        try:
            dbtag = TagWrapper.get_tag_by_name(session, get_current_user_id(player_id=player_id), name)
            tag = Tag.create_from_dbtag(dbtag)
            return tag
        except DBTagNotFound:
            pass
        dbtag = TagWrapper.create_tag(session, get_current_user_id(player_id=player_id), name, private_key=private_key)
        tag = Tag.create_from_dbtag(dbtag)
        return tag

    @staticmethod
    @with_session
    def rename(current_name: str, new_name: str, session=None) -> 'Tag':
        # Check if name already exists
        try:
            TagWrapper.get_tag_by_name(session, get_current_user_id(), new_name)
            raise CalculatedError(409, f"Tag with name {new_name} already exists.")
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

@with_session
def apply_tags_to_game(query_params: Dict[str, any]=None, game_id=None, session=None):
    if query_params is None:
        return None
    if 'tags' not in query_params and 'tag_ids' not in query_params:
        return None
    tags = query_params['tags'] if 'tags' in query_params else []
    tag_ids = query_params['tag_ids'] if 'tag_ids' in query_params else []
    private_ids = query_params['private_tag_keys'] if 'private_tag_keys' in query_params else []
    if len(tags) > 0:
        player_id = query_params['player_id']
        if session.query(Player).filter(Player.platformid == player_id).first() is None:
            log_error(PlayerNotFound())
        else:
            for tag in tags:
                created_tag = Tag.create(tag, session=session, player_id=player_id)
                TagWrapper.add_tag_to_game(session, game_id, created_tag.db_tag)

    for index, tag_id in enumerate(tag_ids):
        tag = TagWrapper.get_tag_by_id(session, tag_id)
        if tag.private_id is not None and tag.private_id == private_ids[index]:
            TagWrapper.add_tag_to_game(session, game_id, tag)

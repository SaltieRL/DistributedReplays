import logging

from sqlalchemy import func

from backend.blueprints.spa_api.service_layers.player.player import Player
from backend.blueprints.spa_api.service_layers.replay.replay import Replay
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import GroupEntry, GroupEntryType
from backend.database.wrapper import player_wrapper
from backend.database.wrapper.stats import player_stat_wrapper
from backend.utils.safe_flask_globals import UserManager

logger = logging.getLogger(__name__)

wrapper = player_stat_wrapper.PlayerStatWrapper(player_wrapper.PlayerWrapper(limit=10))


class Group:
    def __init__(self, entry, ancestors, children):
        self.entry = entry.__dict__
        self.ancestors = ancestors
        self.children = children


class GroupEntryJSON:
    def __init__(self, uuid, owner, name, game, game_object, type, parent):
        self.uuid = uuid
        self.owner = owner
        self.name = name
        self.game = game
        self.gameObject = game_object
        self.type = type
        self.parent = parent

    @classmethod
    def create(cls, obj):
        return cls(
            uuid=obj.uuid,
            owner=Player.create_from_id(obj.owner).__dict__,
            name=obj.name,
            game=obj.game,
            game_object=Replay.create_from_id(obj.game).__dict__ if obj.game is not None else None,
            type=obj.type.value,
            parent=obj.parent.uuid if obj.parent is not None else None
        )


class SavedGroup:
    @staticmethod
    @with_session
    def create(name, owner=None, session=None):
        if owner is None:
            owner = UserManager.get_current_user().platformid
        entry = GroupEntry(engine=session.get_bind(), name=name, owner=owner, type=GroupEntryType.group)
        session.add(entry)
        session.commit()
        return entry.uuid

    @staticmethod
    @with_session
    def add_game(uuid, game, name=None, session=None):
        parent = session.query(GroupEntry).filter(GroupEntry.uuid == uuid).first()
        entry = GroupEntry(engine=session.get_bind(), name=name, game=game, owner=parent.owner,
                           type=GroupEntryType.game, parent=parent)
        session.add(entry)
        session.commit()
        return entry.uuid

    @staticmethod
    @with_session
    def add_subgroup(uuid, name=None, session=None):
        parent = session.query(GroupEntry).filter(GroupEntry.uuid == uuid).first()
        entry = GroupEntry(engine=session.get_bind(), name=name, owner=parent.owner, type=GroupEntryType.group,
                           parent=parent)
        session.add(entry)
        session.commit()
        return entry.uuid

    @staticmethod
    @with_session
    def get_info(uuid, session=None):
        entry = session.query(GroupEntry).filter(GroupEntry.uuid == uuid).first()
        children = session.query(GroupEntry).filter(GroupEntry.path.descendant_of(entry.path)).filter(
            func.nlevel(GroupEntry.path) == len(entry.path) + 1).all()
        ancestors = session.query(GroupEntry).filter(GroupEntry.path.ancestor_of(entry.path)).filter(
            func.nlevel(GroupEntry.path) < len(entry.path)).all()
        return Group(GroupEntryJSON.create(entry), [GroupEntryJSON.create(ancestor).__dict__ for ancestor in ancestors],
                     [GroupEntryJSON.create(child).__dict__ for child in children])

    @staticmethod
    @with_session
    def get_stats(uuid, team=False, session=None):
        path = session.query(GroupEntry).filter(GroupEntry.uuid == uuid).first().path
        games = session.query(GroupEntry).filter(GroupEntry.path.descendant_of(path)).filter(
            GroupEntry.type == GroupEntryType.game).all()
        games = [game.game for game in games]
        stats = wrapper.get_group_stats(games, team=team)
        return stats

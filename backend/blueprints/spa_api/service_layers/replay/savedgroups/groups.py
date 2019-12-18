import logging

from sqlalchemy import func

from backend.blueprints.spa_api.errors.errors import AuthorizationException, ReplayNotFound, NotLoggedIn
from backend.blueprints.spa_api.service_layers.player.player import Player
from backend.blueprints.spa_api.service_layers.replay.replay import Replay
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import GroupEntry, GroupEntryType, Game
from backend.database.wrapper import player_wrapper
from backend.database.wrapper.stats import player_stat_wrapper
from backend.utils.safe_flask_globals import UserManager

logger = logging.getLogger(__name__)

wrapper = player_stat_wrapper.PlayerStatWrapper(player_wrapper.PlayerWrapper(limit=10))


class Group:
    def __init__(self, entry, ancestors, children):
        self.entry = entry
        self.ancestors = ancestors
        self.children = children


class GroupEntryJSON:
    def __init__(self, uuid, owner, name, game, game_object, type, parent, descendant_count):
        self.uuid = uuid
        self.owner = owner
        self.name = name
        self.game = game
        self.gameObject = game_object
        self.type = type
        self.parent = parent
        self.descendantCount = descendant_count

    @classmethod
    def create(cls, obj, descendant_count=0):
        return cls(
            uuid=obj.uuid,
            owner=Player.create_from_id(obj.owner).__dict__,
            name=obj.name,
            game=obj.game,
            game_object=Replay.create_from_id(obj.game, redirect=False).__dict__ if obj.game is not None else None,
            type=obj.type.value,
            parent=obj.parent.uuid if obj.parent is not None else None,
            descendant_count=descendant_count
        )


class SavedGroup:
    @staticmethod
    @with_session
    def create(name, owner=None, session=None):
        if owner is None:
            current_user = UserManager.get_current_user()
            if current_user is not None:
                owner = current_user.platformid
            else:
                raise AuthorizationException()

        entry = GroupEntry(engine=session.get_bind(), name=name, owner=owner, type=GroupEntryType.group)
        session.add(entry)
        session.commit()
        return entry.uuid

    @staticmethod
    @with_session
    def add_game(parent_uuid, game, name=None, session=None):
        current_user = UserManager.get_current_user().platformid
        parent = session.query(GroupEntry).filter(GroupEntry.uuid == parent_uuid).first()
        if parent is None:
            raise ReplayNotFound()
        if parent.owner != current_user:
            raise AuthorizationException()
        game_obj = session.query(Game).filter(Game.hash == game).first()
        if game_obj is None:
            game_obj: Game = session.query(Game).filter(Game.replay_id == game).first()
            if game_obj is not None:
                game = game_obj.hash
        entry = GroupEntry(engine=session.get_bind(), name=name, game=game, owner=parent.owner,
                           type=GroupEntryType.game, parent=parent)
        session.add(entry)
        session.commit()
        return entry.uuid

    @staticmethod
    @with_session
    def delete_entry(uuid, session=None):
        current_user = UserManager.get_current_user().platformid
        entry = session.query(GroupEntry).filter(GroupEntry.uuid == uuid).first()
        if entry.owner != current_user:
            raise AuthorizationException()
        descendants = session.query(GroupEntry).filter(GroupEntry.path.descendant_of(entry.path)).all()
        for desc in descendants:
            session.delete(desc)
        session.delete(entry)
        session.commit()
        return entry.uuid

    @staticmethod
    @with_session
    def add_subgroup(parent_uuid, name=None, session=None):
        current_user = UserManager.get_current_user().platformid
        parent = session.query(GroupEntry).filter(GroupEntry.uuid == parent_uuid).first()
        if parent.owner != current_user:
            raise AuthorizationException()
        entry = GroupEntry(engine=session.get_bind(), name=name, owner=parent.owner, type=GroupEntryType.group,
                           parent=parent)
        session.add(entry)
        session.commit()
        return entry.uuid

    @staticmethod
    @with_session
    def get_info(uuid, session=None) -> Group:
        if uuid is None:
            current_user = UserManager.get_current_user()
            if current_user is not None:
                peak_nodes = session.query(GroupEntry).filter(
                    GroupEntry.owner == current_user.platformid).filter(
                    func.nlevel(GroupEntry.path) == 1).order_by(GroupEntry.id).all()
                children_counts = SavedGroup._children_counts(peak_nodes, session)
                return Group(None, [], [GroupEntryJSON.create(child, descendants).__dict__ for child, (descendants,) in
                                        zip(peak_nodes, children_counts)])
            else:
                raise NotLoggedIn()

        entry = session.query(GroupEntry).filter(GroupEntry.uuid == uuid).first()
        children = session.query(GroupEntry).filter(GroupEntry.path.descendant_of(entry.path)).order_by(GroupEntry.id).filter(
            func.nlevel(GroupEntry.path) == len(entry.path) + 1).all()
        children_counts = SavedGroup._children_counts(children, session)
        ancestors = session.query(GroupEntry).filter(GroupEntry.path.ancestor_of(entry.path)).filter(
            func.nlevel(GroupEntry.path) < len(entry.path)).order_by(func.nlevel(GroupEntry.path)).all()
        return Group(GroupEntryJSON.create(entry).__dict__,
                     [GroupEntryJSON.create(ancestor).__dict__ for ancestor in ancestors],
                     [GroupEntryJSON.create(child, descendants).__dict__ for child, (descendants,) in
                      zip(children, children_counts)])

    @staticmethod
    @with_session
    def get_stats(uuid, team=False, session=None):
        path = session.query(GroupEntry).filter(GroupEntry.uuid == uuid).first().path
        games = session.query(GroupEntry).filter(GroupEntry.path.descendant_of(path)).filter(
            GroupEntry.type == GroupEntryType.game).all()
        games = [game.game for game in games]
        if team:
            stats = wrapper.get_group_team_stats(games)
        else:
            stats = wrapper.get_group_stats(games, ensemble=False)
        return stats

    @staticmethod
    def _children_counts(children, session):
        return [
            (session.query(func.count(GroupEntry.id)).filter(GroupEntry.path.descendant_of(child.path)).filter(
                func.nlevel(GroupEntry.path) > len(child.path)).filter(
                GroupEntry.type == GroupEntryType.game).first() if child.type == GroupEntryType.group else (0,))
            for child in children
        ]

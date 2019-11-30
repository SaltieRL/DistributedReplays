import logging

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import GroupEntry, GroupEntryType
from backend.database.wrapper import player_wrapper
from backend.database.wrapper.stats import player_stat_wrapper
from backend.utils.safe_flask_globals import UserManager

logger = logging.getLogger(__name__)

wrapper = player_stat_wrapper.PlayerStatWrapper(player_wrapper.PlayerWrapper(limit=10))


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
    def get_stats(uuid, session=None):
        path = session.query(GroupEntry).filter(GroupEntry.uuid == uuid).first().path
        games = session.query(GroupEntry).filter(GroupEntry.path.descendant_of(path)).filter(
            GroupEntry.type == GroupEntryType.game).all()
        stats = wrapper.get_group_stats([game.hash for game in games])
        return stats

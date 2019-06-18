from flask import jsonify
from sqlalchemy.orm.attributes import flag_modified

from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Player
from backend.utils.checks import is_admin


class AdminPanelHandler:

    @staticmethod
    @with_session
    def add_group_to_user(id_: str, group: int, session=None):
        if not is_admin():  # putting this here so that it *can't* be run without being admin from anywhere
            raise CalculatedError(401, "Operation not permitted")

        player = session.query(Player).filter(Player.platformid == id_).one_or_none()
        if player is None:
            raise CalculatedError(400, "Player does not exist")

        if player.groups is None:
            player.groups = []

        if group in player.groups:
            raise CalculatedError(400, "Group is already assigned to user")

        player.groups.append(group)
        flag_modified(player, "groups")
        session.add(player)
        session.commit()
        return jsonify({"status": "Success"})

    @staticmethod
    @with_session
    def remove_group_from_user(id_: str, group: int, session=None):
        if not is_admin():  # putting this here so that it *can't* be run without being admin from anywhere
            raise CalculatedError(401, "Operation not permitted")

        player = session.query(Player).filter(Player.platformid == id_).one_or_none()
        if player is None:
            raise CalculatedError(400, "Player does not exist")
        if player.groups is None:
            raise CalculatedError(400, "Player groups is None")
        if group not in player.groups:
            raise CalculatedError(400, "Group is not assigned to user")

        player.groups.remove(group)
        # SQLAlchemy needs this flag to be set to actually update the DB for whatever reason
        flag_modified(player, "groups")
        session.add(player)
        session.commit()
        return jsonify({"status": "Success", "groups": player.groups})

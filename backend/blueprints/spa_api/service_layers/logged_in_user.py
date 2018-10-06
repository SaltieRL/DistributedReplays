from flask import g, current_app

from backend.blueprints.steam import get_steam_profile_or_random_response
from backend.utils.checks import is_local_dev
from ..errors.errors import CalculatedError, TagNotFound
from backend.database.objects import Tag


class LoggedInUser:
    def __init__(self, name: str, id_: str, avatar_link: str, admin: bool, alpha: bool, beta: bool):
        self.name = name
        self.id = id_
        self.avatarLink = avatar_link
        self.admin = admin
        self.alpha = alpha
        self.beta = beta

    @staticmethod
    def create() -> 'LoggedInUser':
        if is_local_dev():
            mock_steam_profile = get_steam_profile_or_random_response("TESTLOCALUSER")['response']['players'][0]
            name = mock_steam_profile['personaname']
            id_ = mock_steam_profile['steamid']
            avatar_link = mock_steam_profile['avatarfull']
            return LoggedInUser(name, id_, avatar_link, True, True, True)
        if g.user is None:
            raise CalculatedError(404, "User is not logged in.")
        return LoggedInUser(g.user.platformname, g.user.platformid, g.user.avatar, g.admin, g.alpha, g.beta)

    def create_tag(self, name: str):
        session = current_app.config['db']()
        tag = session.query(Tag).filter(Tag.owner == self.id, Tag.name == name).first()
        if tag is None:
            tag = Tag(name=name, owner=self.id)
        else:
            raise CalculatedError(400, "Tag already exists.")
        session.add(tag)
        session.commit()
        session.close()

    def rename_tag(self, old_name: str, new_name: str):
        session = current_app.config['db']()
        tag = self.get_tag(old_name, session)
        tag.name = new_name
        session.commit()
        session.close()

    def get_tags(self):
        session = current_app.config['db']()
        return session.query(Tag).filter(Tag.owner == self.id).all()

    def remove_tag(self, name: str):
        session = current_app.config['db']()
        tag = self.get_tag(name, session)
        session.delete(tag)
        session.commit()
        session.close()
        return

    def get_tag(self, name: str, session=None):
        no_ses_ref = session is None

        if no_ses_ref:
            session = current_app.config['db']()

        tag = session.query(Tag).filter(Tag.owner == self.id, Tag.name == name).first()

        if no_ses_ref:
            session.close()

        if tag is None:
            raise TagNotFound
        else:
            return tag

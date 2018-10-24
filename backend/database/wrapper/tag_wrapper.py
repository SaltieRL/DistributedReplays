from typing import List

from flask import current_app
from sqlalchemy import func

from backend.blueprints.spa_api.errors.errors import ReplayNotFound
from backend.database.objects import Tag, Game, GameTag


class TagWrapper:
    @staticmethod
    def create_tag(session, user_id: str, name: str) -> Tag:
        tag = Tag(name=name, owner=user_id)
        session.add(tag)
        session.commit()
        return tag

    @staticmethod
    def rename_tag(session, user_id: str, old_name: str, new_name: str) -> Tag:
        tag = TagWrapper.get_tag(user_id, old_name, session)
        tag.name = new_name
        session.commit()
        return tag

    @staticmethod
    def get_tags(session, user_id: str) -> List[Tag]:
        return session.query(Tag).filter(Tag.owner == user_id).all()

    @staticmethod
    def delete_tag(user_id: str, name: str):
        session = current_app.config['db']()
        try:
            tag = TagWrapper.get_tag(user_id, name, session)
        except DBTagNotFound:
            session.close()
            raise DBTagNotFound()
        session.delete(tag)
        session.commit()
        session.close()

    @staticmethod
    def get_tag(user_id: str, name: str, session=None) -> Tag:
        no_ses_ref = session is None

        if no_ses_ref:
            session = current_app.config['db']()

        tag = session.query(Tag).filter(Tag.owner == user_id, Tag.name == name).first()

        if no_ses_ref:
            session.close()

        if tag is None:
            raise DBTagNotFound()
        return tag

    @staticmethod
    def add_tag_to_game(game_id: str, user_id: str, tag_name: str) -> None:
        session = current_app.config['db']()
        tag: Tag = session.query(Tag).filter(Tag.owner == user_id, Tag.name == tag_name).first()
        if tag is None:
            raise DBTagNotFound()
        game = session.query(Game).filter(Game.hash == game_id).first()
        if game is None:
            raise ReplayNotFound()
        if tag not in game.tags:
            game.tags.append(tag)
            session.commit()
        # TODO maybe add else
        session.close()

    @staticmethod
    def remove_tag_from_game(game_id: str, user_id: str, tag_name: str) -> None:
        session = current_app.config['db']()
        try:
            tag = TagWrapper.get_tag(user_id, tag_name, session)
        except DBTagNotFound:
            session.close()
            raise DBTagNotFound()
        game = session.query(Game).filter(Game.hash == game_id).first()
        if game is None:
            raise ReplayNotFound()
        if tag is not None:
            try:
                game.tags.remove(tag)
                session.commit()
            except ValueError:
                session.close()
                raise DBTagNotFound()
        session.close()

    @staticmethod
    def get_tagged_games(user_id: str, names):
        session = current_app.config['db']()
        game_tags = session.query(GameTag.game_id) \
            .join(Tag) \
            .filter(Tag.owner == user_id) \
            .filter(Tag.name.in_(names)) \
            .group_by(GameTag.game_id) \
            .having(func.count(GameTag.game_id) == len(names)).all()
        session.close()

        if len(game_tags) == 0:
            raise ReplayNotFound()

        return [game_tag.game_id for game_tag in game_tags]


class DBTagNotFound(Exception):
    pass

from typing import List

from flask import current_app
from sqlalchemy import func

from backend.blueprints.spa_api.errors.errors import ReplayNotFound
from backend.database.objects import Tag, Game, GameTag


class TagWrapper:
    @staticmethod
    def create_tag(session, user_id: str, name: str, private_key: str = None) -> Tag:
        tag = Tag(name=name, owner=user_id, private_id=private_key)
        session.add(tag)
        session.commit()
        return tag

    @staticmethod
    def rename_tag(session, user_id: str, old_name: str, new_name: str) -> Tag:
        tag = TagWrapper.get_tag_by_name(session, user_id, old_name)
        tag.name = new_name
        session.commit()
        return tag

    @staticmethod
    def get_tags(session, user_id: str) -> List[Tag]:
        return session.query(Tag).filter(Tag.owner == user_id).all()

    @staticmethod
    def delete_tag(session, user_id: str, name: str):
        tag = TagWrapper.get_tag_by_name(session, user_id, name)
        session.delete(tag)
        session.commit()

    @staticmethod
    def get_tag_by_name(session, user_id: str, name: str) -> Tag:
        tag = session.query(Tag).filter(Tag.owner == user_id, Tag.name == name).first()
        if tag is None:
            raise DBTagNotFound()
        return tag

    @staticmethod
    def get_tag_by_id(session, tag_id: str) -> Tag:
        tag = session.query(Tag).filter(Tag.id == tag_id).first()
        if tag is None:
            raise DBTagNotFound()
        return tag

    @staticmethod
    def add_tag_by_name_to_game(session, game_id: str, user_id: str, tag_name: str) -> None:
        tag: Tag = session.query(Tag).filter(Tag.owner == user_id, Tag.name == tag_name).first()
        if tag is None:
            raise DBTagNotFound()
        TagWrapper.add_tag_to_game(session, game_id, tag)

    @staticmethod
    def add_tag_to_game(session, game_id: str, tag: Tag) -> None:
        game = session.query(Game).filter(Game.hash == game_id).first()
        if game is None:
            raise ReplayNotFound()
        if tag not in game.tags:
            game.tags.append(tag)
            session.commit()

    @staticmethod
    def remove_tag_from_game(session, game_id: str, user_id: str, tag_name: str) -> None:
        tag = TagWrapper.get_tag_by_name(session, user_id, tag_name)
        game = session.query(Game).filter(Game.hash == game_id).first()
        if game is None:
            raise ReplayNotFound()
        if tag is not None:
            try:
                game.tags.remove(tag)
                session.commit()
            except ValueError:
                raise DBTagNotFound()

    @staticmethod
    def get_tagged_games(session, user_id: str, names):
        game_tags = session.query(GameTag.game_id) \
            .join(Tag) \
            .filter(Tag.owner == user_id) \
            .filter(Tag.name.in_(names)) \
            .group_by(GameTag.game_id) \
            .having(func.count(GameTag.game_id) == len(names)).all()

        if len(game_tags) == 0:
            raise ReplayNotFound()

        return [game_tag.game_id for game_tag in game_tags]


class DBTagNotFound(Exception):
    pass

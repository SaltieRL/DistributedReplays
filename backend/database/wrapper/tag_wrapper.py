from sqlalchemy import func

from backend.blueprints.spa_api.errors.errors import TagNotFound, CalculatedError, ReplayNotFound
from backend.database.objects import Tag, Game, GameTag

from flask import current_app


class TagWrapper:
    @staticmethod
    def create_tag(user_id: str, name: str):
        session = current_app.config['db']()
        tag = session.query(Tag).filter(Tag.owner == user_id, Tag.name == name).first()
        if tag is None:
            tag = Tag(name=name, owner=user_id)
        else:
            raise CalculatedError(400, "Tag already exists.")
        session.add(tag)
        session.commit()
        session.close()

    @staticmethod
    def rename_tag(user_id: str, old_name: str, new_name: str):
        session = current_app.config['db']()
        tag_test = session.query(Tag).filter(Tag.owner == user_id, Tag.name == new_name).first()
        if tag_test is not None:
            raise CalculatedError(400, "Name is already taken.")
        tag = TagWrapper.get_tag(user_id, old_name, session)
        tag.name = new_name
        session.commit()
        session.close()

    @staticmethod
    def get_tags(user_id: str):
        session = current_app.config['db']()
        return session.query(Tag).filter(Tag.owner == user_id).all()

    @staticmethod
    def remove_tag(user_id: str, name: str):
        session = current_app.config['db']()
        tag = TagWrapper.get_tag(user_id, name, session)
        session.delete(tag)
        session.commit()
        session.close()

    @staticmethod
    def get_tag(user_id: str, name: str, session=None):
        no_ses_ref = session is None

        if no_ses_ref:
            session = current_app.config['db']()

        tag = session.query(Tag).filter(Tag.owner == user_id, Tag.name == name).first()

        if no_ses_ref:
            session.close()

        if tag is None:
            raise TagNotFound
        else:
            return tag

    @staticmethod
    def add_tag_to_game(game_id: str, user_id: str, tag_name: str):
        session = current_app.config['db']()
        tag = session.query(Tag).filter(Tag.owner == user_id, Tag.name == tag_name).first()
        if tag is None:
            raise TagNotFound
        game = session.query(Game).filter(Game.hash == game_id).first()
        if game is None:
            raise ReplayNotFound
        if tag not in game.tags:
            game.tags.append(tag)
            session.commit()
        session.close()
        return tag
        # TODO maybe add else

    @staticmethod
    def remove_tag_from_game(game_id: str, user_id: str, tag_name: str):
        session = current_app.config['db']()
        tag = session.query(Tag).filter(Tag.owner == user_id, Tag.name == tag_name).first()
        game = session.query(Game).filter(Game.hash == game_id).first()
        if game is None:
            raise ReplayNotFound
        if tag is not None:
            game.tags.remove(tag)
            session.commit()
        session.close()
        return tag

    @staticmethod
    def get_tagged_games(user_id: str, names):
        session = current_app.config['db']()
        game_tags = session.query(GameTag.game_id).\
            join(Tag).\
            filter(Tag.owner == user_id).\
            filter(Tag.name.in_(names)).\
            group_by(GameTag.game_id).\
            having(func.count(GameTag.game_id) == len(names)).all()
        session.close()

        if len(game_tags) == 0:
            raise ReplayNotFound

        return [game_tag.game_id for game_tag in game_tags]

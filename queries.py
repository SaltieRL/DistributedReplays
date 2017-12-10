from sqlalchemy import exists, func
from objects import User, Replay, Model


def create_user_if_not_exist(session, user):
    ex = session.query(exists().where(User.name == user)).scalar()
    if not ex:
        new_user = User(name=user, password='')
        session.add(new_user)
        session.commit()


def create_model_if_not_exist(session, model_hash):
    ex = session.query(exists().where(Model.model_hash == model_hash)).scalar()
    if not ex:
        new_model = Model(model_hash=model_hash, model_type=-1, model_size=-1, total_reward=-100000, evaluated=False)
        session.add(new_model)
        session.commit()
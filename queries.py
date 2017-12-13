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


def get_bot_names():
    return ['Armstrong',
    'Bandit',
    'Beast',
    'Boomer',
    'Buzz',
    'Casper',
    'Caveman',
    'C-Block',
    'Centice',
    'Chipper',
    'Cougar',
    'Dude',
    'Foamer',
    'Fury',
    'Gerwin',
    'Goose',
    'Heater',
    'Hollywood',
    'Hound',
    'Iceman',
    'Imp',
    'Jester',
    'JM',
    'Junker',
    'Khan',
    'Maverick',
    'Middy',
    'Merlin',
    'Mountain',
    'Myrtle',
    'Outlaw',
    'Poncho',
    'Rainmaker',
    'Raja',
    'Rex',
    'Roundhouse',
    'Sabretooth',
    # 'Saltie', (you get saved for later)
    'Samara',
    'Scout',
    'Shepard',
    'Slider',
    'Squall',
    'Sticks',
    'Stinger',
    'Storm',
    'Sundown',
    'Sultan',
    'Swabbie',
    'Tusk',
    'Tex',
    'Viper',
    'Wolfman',
    'Yuri']


def get_replay_stats(session):
    return session.query(Replay.user, func.count(Replay.user).label('total'), User.name) \
        .join(User) \
        .group_by(Replay.user, User.id).order_by('total DESC').all()


def get_model_stats(session):
    return session.query(Replay.model_hash,
                         func.row_number().over(order_by=Model.model_hash), Model.total_reward, func.count(Replay.model_hash).label('total')) \
        .join(Model) \
        .group_by(Replay.model_hash, Model.model_hash).order_by('models.total_reward ASC').all()


def get_replay_count(session):
    return session.query(func.count(Replay.id)).first()[0]
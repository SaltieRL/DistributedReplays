import datetime
from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    password = Column(String(128))

    def __repr__(self):
        return "<User(name='%s')>" % self.name


class Replay(Base):
    __tablename__ = 'replays'

    id = Column(Integer, primary_key=True)
    uuid = Column(String(50))
    user = Column(Integer, ForeignKey("users.id"))
    ip = Column(String(64))
    num_players = Column(Integer)
    num_team0 = Column(Integer)
    model_hash = Column(String(40), ForeignKey("models.model_hash"))  # always 40 chars long
    is_eval = Column(Boolean)
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
    def __repr__(self):
        return "<Replay(uuid='%s', user='%s', ip='%s')>" % (self.uuid, self.user, self.ip)


class Model(Base):
    __tablename__ = 'models'

    model_hash = Column(String(40), primary_key=True)
    model_type = Column(Integer)
    model_size = Column(Integer)
    total_reward = Column(Float)
    evaluated = Column(Boolean)

    def __repr__(self):
        return "<Model(model_hash='%s', total_reward='%s', evaluated='%s')>" % (self.model_hash,
                                                                                self.total_reward, self.evaluated)

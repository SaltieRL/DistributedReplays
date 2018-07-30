# ORM objects
import datetime
import enum
from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Enum
from sqlalchemy.dialects import postgresql
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class Playlist(enum.Enum):
    duel = 1
    doubles = 2
    solo = 3
    standard = 4
    chaos = 5


class PlatformName(enum.Enum):
    steam = 1
    ps4 = 2
    xbox = 3
    switch = 4
    other = 5



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
    model_hash = Column(String(40))  # ForeignKey("models.model_hash"))  # always 40 chars long
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


class Game(Base):
    __tablename__ = 'games'

    id = Column(Integer, primary_key=True)
    hash = Column(String(40))  # replayid
    players = Column(postgresql.ARRAY(String, dimensions=1))
    map = Column(String(40))
    ranks = Column(postgresql.ARRAY(Integer, dimensions=1))
    mmrs = Column(postgresql.ARRAY(Integer, dimensions=1))
    teamsize = Column(Integer)
    team0score = Column(Integer)
    team1score = Column(Integer)
    matchtype = Column(Enum(Playlist))
    playergames = relationship("PlayerGame")  # TODO: should this just replace .players?
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)

class Player(Base):
    __tablename__ = 'players'
    id = Column(Integer, primary_key=True)
    platformid = Column(String(40), primary_key=True)
    platformname = Column(String(10))
    avatar = Column(String(100))
    ranks = Column(postgresql.ARRAY(Integer, dimensions=1))  # foreign key


class PlayerGame(Base):
    __tablename__ = 'playergame'

    id = Column(Integer, primary_key=True)
    player = relationship('Player')
    hash = Column(String(40), ForeignKey('games.hash'))
    score = Column(Integer)
    goals = Column(Integer)
    assists = Column(Integer)
    saves = Column(Integer)
    shots = Column(Integer)

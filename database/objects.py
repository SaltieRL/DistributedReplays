# ORM objects
import datetime
import enum
from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Enum
from sqlalchemy.dialects import postgresql
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

DBObjectBase = declarative_base()


class Playlist(enum.Enum):
    duel = 1
    doubles = 2
    solo = 3
    standard = 4
    chaos = 5


class PlatformName(enum.Enum):
    unknown = 0
    steam = 1
    ps4 = 2
    xbox = 4
    switch = 6


class MatchType(enum.Enum):
    private = 1
    unlisted = 2
    public = 3


class User(DBObjectBase):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    password = Column(String(128))

    def __repr__(self):
        return "<User(name='%s')>" % self.name


class Replay(DBObjectBase):
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


class Model(DBObjectBase):
    __tablename__ = 'models'

    model_hash = Column(String(40), primary_key=True)
    model_type = Column(Integer)
    model_size = Column(Integer)
    total_reward = Column(Float)
    evaluated = Column(Boolean)

    def __repr__(self):
        return "<Model(model_hash='%s', total_reward='%s', evaluated='%s')>" % (self.model_hash,
                                                                                self.total_reward, self.evaluated)


class PlayerGame(DBObjectBase):
    __tablename__ = 'playergames'

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    player = Column(String(40), ForeignKey('players.platformid'), index=True)
    player_object = relationship('Player', foreign_keys=[player])
    game = Column(String(40), ForeignKey('games.hash'), index=True)
    game_object = relationship("Game", foreign_keys=[game])

    # game information
    is_orange = Column(Boolean)
    win = Column(Boolean)
    score = Column(Integer)
    goals = Column(Integer)
    assists = Column(Integer)
    saves = Column(Integer)
    shots = Column(Integer)

    # camera stuff
    field_of_view = Column(Integer)
    transition_speed = Column(Integer)
    pitch = Column(Integer)
    swivel_speed = Column(Integer)
    stiffness = Column(Float)
    height = Column(Integer)
    distance = Column(Integer)

    # game specific stuff
    car = Column(Integer)

    # hit analysis stuff
    total_hits = Column(Integer)
    total_dribbles = Column(Integer)
    total_dribble_conts = Column(Integer)
    total_saves = Column(Integer)
    total_goals = Column(Integer)
    total_shots = Column(Integer)
    total_passes = Column(Integer)

    # other analysis stuff
    turnovers = Column(Integer)
    possession_time = Column(Float)


class Game(DBObjectBase):
    __tablename__ = 'games'
    hash = Column(String(40), primary_key=True)  # replayid
    name = Column(String(40))
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
    match_date = Column(DateTime)
    team0possession = Column(Float)
    team1possession = Column(Float)


class Player(DBObjectBase):
    __tablename__ = 'players'
    platformid = Column(String(40), primary_key=True)
    platformname = Column(String(50))
    avatar = Column(String(150))
    ranks = Column(postgresql.ARRAY(Integer, dimensions=1))  # foreign key
    games = relationship('PlayerGame')


class CameraSettings(DBObjectBase):
    __tablename__ = 'camera_settings'
    id = Column(Integer, primary_key=True, autoincrement=True)
    field_of_view = Column(Integer)
    transition_speed = Column(Integer)
    pitch = Column(Integer)
    swivel_speed = Column(Integer)
    stiffness = Column(Float)
    height = Column(Integer)
    distance = Column(Integer)

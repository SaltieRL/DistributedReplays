# ORM objects
import datetime
import enum

from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Enum, Table, UniqueConstraint
from sqlalchemy.dialects import postgresql
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, validates

DBObjectBase = declarative_base()


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


class Playlist(enum.Enum):
    UNRANKED_DUELS = 1
    UNRANKED_DOUBLES = 2
    UNRANKED_STANDARD = 3
    UNRANKED_CHAOS = 4
    CUSTOM_LOBBY = 6
    UNKNOWN = 8
    RANKED_DUELS = 10
    RANKED_DOUBLES = 11
    RANKED_SOLO_STANDARD = 12
    RANKED_STANDARD = 13
    UNRANKED_SNOW_DAY = 15
    ROCKET_LABS = 16
    RANKED_HOOPS = 27
    RANKED_RUMBLE = 28
    RANKED_DROPSHOT = 29
    RANKED_SNOW_DAY = 30


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
    rank = Column(Integer)
    division = Column(Integer, default=0)
    mmr = Column(Integer)

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
    total_aerials = Column(Integer)

    # other analysis stuff
    turnovers = Column(Integer)
    turnovers_on_my_half = Column(Integer)
    turnovers_on_their_half = Column(Integer)
    won_turnovers = Column(Integer)
    possession_time = Column(Float)
    average_speed = Column(Float)
    average_hit_distance = Column(Float)
    average_distance_from_center = Column(Float)  # Average distance for this player from the team center

    # boost
    boost_usage = Column(Float)
    num_small_boosts = Column(Integer)
    num_large_boosts = Column(Integer)
    num_stolen_boosts = Column(Integer)
    wasted_collection = Column(Float)
    wasted_usage = Column(Float)
    time_full_boost = Column(Float)
    time_low_boost = Column(Float)
    time_no_boost = Column(Float)
    average_boost_level = Column(Float)
    wasted_big = Column(Float)
    wasted_small = Column(Float)

    # tendencies
    time_on_ground = Column(Float)
    time_low_in_air = Column(Float)
    time_high_in_air = Column(Float)
    time_in_defending_half = Column(Float)
    time_in_attacking_half = Column(Float)
    time_in_defending_third = Column(Float)
    time_in_neutral_third = Column(Float)
    time_in_attacking_third = Column(Float)
    time_behind_ball = Column(Float)
    time_in_front_ball = Column(Float)
    time_closest_to_ball = Column(Float)
    time_furthest_from_ball = Column(Float)
    time_close_to_ball = Column(Float)
    time_near_wall = Column(Float)
    time_in_corner = Column(Float)

    # distance
    ball_hit_forward = Column(Float)
    ball_hit_backward = Column(Float)

    # controller
    is_keyboard = Column(Boolean)

    # speed
    time_at_boost_speed = Column(Float)
    time_at_slow_speed = Column(Float)
    time_at_super_sonic = Column(Float)

    # distance
    time_closest_to_team_center = Column(Float)
    time_furthest_from_team_center = Column(Float)

    # metadata
    is_bot = Column(Boolean)
    first_frame_in_game = Column(Integer)
    time_in_game = Column(Float)

    # relative positioning
    time_in_front_of_center_of_mass = Column(Float)
    time_behind_center_of_mass = Column(Float)
    time_most_forward_player = Column(Float)
    time_most_back_player = Column(Float)
    time_between_players = Column(Float)

    @validates('player')
    def validate_code(self, key, value):
        max_len = getattr(self.__class__, key).prop.columns[0].type.length
        if value and len(value) > max_len:
            return value[:max_len]
        return value


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
    teamstats = relationship("TeamStat")
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
    match_date = Column(DateTime)
    team0possession = Column(Float)
    team1possession = Column(Float)
    frames = Column(Integer)

    tags = relationship('Tag', secondary='game_tags', back_populates='games')

    # metadata
    version = Column(Integer)
    length = Column(Float, default=300.0)
    game_server_id = Column(Integer)
    server_name = Column(String(40))
    replay_id = Column(String(40))
    playlist = Column(Integer)
    invalid_analysis = Column(Boolean)

    @validates('name')
    def validate_code(self, key, value):
        max_len = getattr(self.__class__, key).prop.columns[0].type.length
        if value and len(value) > max_len:
            return value[:max_len]
        return value


class Player(DBObjectBase):
    __tablename__ = 'players'
    platformid = Column(String(40), primary_key=True)
    platformname = Column(String(50))
    avatar = Column(String(150))
    ranks = Column(postgresql.ARRAY(Integer, dimensions=1))  # foreign key
    games = relationship('PlayerGame')
    groups = Column(postgresql.ARRAY(Integer, dimensions=1), default=[])
    owned_tags = relationship('Tag')

    @validates('platformid')
    def validate_code(self, key, value):
        max_len = getattr(self.__class__, key).prop.columns[0].type.length
        if value and len(value) > max_len:
            return value[:max_len]
        return value


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


class Group(DBObjectBase):
    __tablename__ = 'groups'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50))


class TeamStat(DBObjectBase):
    __tablename__ = 'teamstats'
    id = Column(Integer, primary_key=True, autoincrement=True)
    game = Column(String(40), ForeignKey('games.hash'), index=True)
    game_object = relationship("Game", foreign_keys=[game])
    is_orange = Column(Boolean)

    # Center of Mass
    average_distance_from_center = Column(Float)
    average_max_distance_from_center = Column(Float)
    time_clumped = Column(Float)
    time_boondocks = Column(Float)
    # tendencies
    time_on_ground = Column(Float)
    time_low_in_air = Column(Float)
    time_high_in_air = Column(Float)
    time_in_defending_half = Column(Float)
    time_in_attacking_half = Column(Float)
    time_in_defending_third = Column(Float)
    time_in_neutral_third = Column(Float)
    time_in_attacking_third = Column(Float)
    time_behind_ball = Column(Float)
    time_in_front_ball = Column(Float)


class Tag(DBObjectBase):
    __tablename__ = 'tags'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(40))
    owner = Column(String(40), ForeignKey('players.platformid'), index=True)
    games = relationship('Game', secondary='game_tags', back_populates='tags')
    __table_args_ = (UniqueConstraint(name, owner, name='unique_names'))


class GameTag(DBObjectBase):
    __tablename__ = 'game_tags'
    game_id = Column(String(40), ForeignKey('games.hash'), primary_key=True)
    tag_id = Column(Integer, ForeignKey('tags.id'), primary_key=True)


# User settings

class Settings(DBObjectBase):
    @classmethod
    def create(cls, key, value, user):
        settings = Settings()
        settings.key = key
        settings.value = value
        settings.user = user
        return settings

    __tablename__ = 'settings'
    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(String(40))
    value = Column(JSON)
    user = Column(String(40), ForeignKey('players.platformid'), index=True)

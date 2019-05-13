import logging
from typing import Tuple, Optional

import redis
from redis import Redis
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from backend.database.objects import DBObjectBase

logger = logging.getLogger(__name__)


def login(connection_string, recreate_database=False) -> Tuple[create_engine, sessionmaker]:
    print(connection_string)
    engine = create_engine(connection_string, echo=False)
    if recreate_database:
        conn = engine.connect()
        conn.execute("commit")
        conn.execute("create database saltie")
        conn.close()
        engine = create_engine(connection_string + '/saltie', echo=False)
    DBObjectBase.metadata.create_all(engine)
    session = sessionmaker(bind=engine)
    return engine, session


def startup() -> sessionmaker:
    try:
        # Sql Stuff
        connection_string = 'postgresql:///saltie'
        engine, session = login(connection_string)
    except OperationalError as e:
        print('trying backup info', e)
        try:
            engine, session = login('postgresql://postgres:postgres@localhost/saltie')
        except Exception as e:
            engine, session = login('postgresql://postgres:postgres@localhost', recreate_database=True)
    return session


stored_session: sessionmaker = None
stored_redis = None


def lazy_startup():
    global stored_session
    if stored_session is not None:
        return stored_session
    stored_session = EngineStartup.startup()
    return stored_session


def lazy_get_redis():
    global stored_redis
    if stored_redis is not None:
        return stored_redis
    stored_redis = EngineStartup.get_redis()
    return stored_redis


def get_strict_redis():
    return EngineStartup.get_strict_redis()


# session getting
class EngineStartup:
    @staticmethod
    def startup() -> sessionmaker:
        try:
            # Sql Stuff
            connection_string = 'postgresql:///saltie'
            engine, session = login(connection_string)
        except OperationalError as e:
            print('trying backup info', e)
            try:
                engine, session = login('postgresql://postgres:postgres@localhost/saltie')
            except Exception as e:
                engine, session = login('postgresql://postgres:postgres@localhost', recreate_database=True)
        stored_session = session
        return session

    @staticmethod
    def get_redis() -> Optional[Redis]:
        try:
            _redis = Redis(
                host='localhost',
                port=6379)
            _redis.get('test')  # Make Redis try to actually use the connection, to generate error if not connected.
            stored_redis = _redis
            return _redis
        except:  # TODO: Investigate and specify this except.
            logger.error("Not using redis.")
            return None

    @staticmethod
    def get_strict_redis():
        return redis.StrictRedis()

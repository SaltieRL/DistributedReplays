import logging
from typing import Tuple, Optional

import redis
from flask import current_app
from redis import Redis
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker

from backend.database.objects import DBObjectBase

try:
    import config
    DB_IP = config.DB_IP
    DB_USER = config.DB_USER
    DB_PASSWORD = config.DB_PASSWORD
except:
    DB_IP = None
    DB_USER = None
    DB_PASSWORD = None

logger = logging.getLogger(__name__)


def login(connection_string, recreate_database=False) -> Tuple[create_engine, sessionmaker]:
    print(connection_string)
    engine = create_engine(connection_string, echo=False, pool_recycle=1800)
    if recreate_database:
        conn = engine.connect()
        conn.execute("commit")
        conn.execute("create database saltie")
        conn.close()
        engine = create_engine(connection_string + '/saltie', echo=False)
    conn = engine.connect()
    conn.execute("create extension if not exists ltree WITH schema public;")
    conn.execute("create extension if not exists ltree;")
    conn.execute("commit")
    conn.close()
    DBObjectBase.metadata.create_all(engine)
    session = sessionmaker(bind=engine)
    return engine, session


def get_current_session():
    return EngineStartup.get_current_session()


stored_session: sessionmaker = None
stored_redis = None
redis_attempted = False


def lazy_startup():
    global stored_session
    if stored_session is not None:
        return stored_session
    stored_session = EngineStartup.startup()
    return stored_session


def lazy_get_redis():
    global stored_redis
    global redis_attempted
    if stored_redis is not None or redis_attempted:
        return stored_redis
    stored_redis = EngineStartup.get_redis()
    redis_attempted = True
    return stored_redis


def get_strict_redis():
    return EngineStartup.get_strict_redis()


# session getting
class EngineStartup:
    @staticmethod
    def login_db() -> Tuple[any, sessionmaker]:
        if DB_IP is not None:
            connection_string = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_IP}/saltie'
            engine, session = login(connection_string)
            return engine, session
        try:
            # Sql Stuff
            connection_string = 'postgresql:///saltie'
            engine, session = login(connection_string)
        except OperationalError as e:
            print('trying backup info', e)
            try:
                engine, session = login('postgresql://postgres:postgres@localhost/saltie')
            except Exception as e:
                print(e)
                engine, session = login('postgresql://postgres:postgres@localhost', recreate_database=True)
        return engine, session

    @staticmethod
    def startup() -> sessionmaker:
        _, session = EngineStartup.login_db()
        return session

    @staticmethod
    def get_redis() -> Optional[Redis]:
        try:
            _redis = Redis(
                host='localhost',
                port=6379)
            _redis.get('test')  # Make Redis try to actually use the connection, to generate error if not connected.
            return _redis
        except:  # TODO: Investigate and specify this except.
            logger.error("Not using redis.")
            return None

    @staticmethod
    def get_strict_redis():
        return redis.StrictRedis()

    @staticmethod
    def get_current_session():
        try:
            return current_app.config['db']()
        except:
            _session = lazy_startup()
            return _session()

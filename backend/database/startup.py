from typing import Tuple

from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from backend.database.objects import DBObjectBase


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


def startup():
    return EngineStartup.startup()


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
        return session
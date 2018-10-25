import os

from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from backend.database.objects import DBObjectBase


def login(connection_string, recreate_database=False):
    print(connection_string)
    engine = create_engine(connection_string, echo=False)
    if recreate_database:
        conn = engine.connect()
        conn.execute("commit")
        conn.execute("create database saltie")
        conn.close()
        engine = create_engine(connection_string + '/saltie', echo=False)
    DBObjectBase.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    return engine, Session


def startup():
    try:
        # Sql Stuff
        connection_string = 'postgresql:///saltie'
        engine, Session = login(connection_string)
    except OperationalError as e:
        print('trying backup info', e)
        postgres_host = os.env.get('POSTGRES_HOST', 'localhost')
        postgres_addr = 'postgresql://postgres:postgres@{}'.format(postgres_host)
        try:
            engine, Session = login('{}/saltie'.format(postgres_addr))
        except Exception as e:
            engine, Session = login(postgres_addr, recreate_database=True)
    return engine, Session

from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from objects import Base


def login(connection_string, recreate_database=False):
    print(connection_string)
    engine = create_engine(connection_string, echo=True)
    if recreate_database:
        conn = engine.connect()
        conn.execute("commit")
        conn.execute("create database saltie")
        conn.close()
        engine = create_engine(connection_string + '/saltie', echo=True)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    return engine, Session



def startup():
    try:
        # Sql Stuff
        connection_string = 'postgresql:///saltie'
        engine, Session = login(connection_string)
    except OperationalError as e:
        print('trying backup info', e)
        try:
            engine, Session = login('postgresql://postgres:postgres@localhost/saltie')
        except Exception as e:
            engine, Session = login('postgresql://postgres:postgres@localhost', recreate_database=True)
    return engine, Session
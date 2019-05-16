import contextlib
from typing import List, Tuple

from alchemy_mock.mocking import UnifiedAlchemyMagicMock
from unittest import mock

from sqlalchemy.dialects.postgresql.base import PGInspector

from backend.database import startup
from backend.database.objects import Player
from backend.database.utils.utils import add_objects
from tests.utils.replay_utils import parse_file


def create_initial_mock_database(existing_data: List[Tuple] = None) -> Tuple[UnifiedAlchemyMagicMock, List[Tuple]]:
    from backend.database.objects import Group
    from backend.server_constants import SERVER_PERMISSION_GROUPS

    initial_data = []
    for index, group in enumerate(SERVER_PERMISSION_GROUPS):
        initial_data.append(
            (
                [mock.call.query(Group),
                 mock.call.filter(Group.name == group)],
                [Group(id=index, name=group)]
            )
        )
    if existing_data is not None:
        merged = initial_data + existing_data
    else:
        merged = initial_data
    return UnifiedAlchemyMagicMock(data=merged), merged


def initialize_db():
    sessionmaker = startup.lazy_startup()
    session = sessionmaker()
    return session


def initialize_db_with_replays(replay_list, session=None):
    if session is None:
        session = initialize_db()
    add_initial_player(session)
    guids = []
    protos = []
    for replay in replay_list:
        replay, proto, guid = parse_file(replay)
        add_objects(proto, session=session)
        guids.append(guid)
        protos.append(proto)
    return session, protos, guids


def print_entire_db(inspector: PGInspector, session):
    for table in inspector.get_table_names():
        pass
    #https://stackoverflow.com/questions/21310549/list-database-tables-with-sqlalchemy/21346185


def default_player_id():
    return '10'


def add_initial_player(session):
    session.add(Player(platformid=default_player_id()))
    session.commit()


def empty_database(engine, session=None):
    from backend.database.objects import DBObjectBase
    tables = DBObjectBase.metadata.sorted_tables

    print('tables should be empty now')
    if session is not None:
        sess = session()
        for table in reversed(tables):
            print('Clear table %s' % table)
            try:

                rows_deleted = sess.query(table).delete()
                sess.commit()
                print(rows_deleted, 'from table')
            except:
                print('oopsies')

        sess.close()

    # empty tables
    for table in reversed(tables):
        print('Clear table %s' % table)
        with contextlib.closing(engine.connect()) as con:
            trans = con.begin()
            try:
                rows_deleted = con.execute(table.delete())
                print(rows_deleted, 'from table')
            except Exception as e:
                print(e)
            trans.commit()
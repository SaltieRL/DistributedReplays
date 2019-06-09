import glob

import os
from sqlalchemy import create_engine, exists
from sqlalchemy.orm import sessionmaker

try:
    import config
except ImportError:
    config = {'db_user': None, 'db_password': None }
from backend.database.objects import DBObjectBase, User, Replay, Model

connection_string = 'postgresql:///saltie'.format(config.db_user, config.db_password)
print (connection_string)
engine = create_engine(connection_string, echo=True)
DBObjectBase.metadata.create_all(engine)
Session = sessionmaker(bind=engine)

session = session()

for replay in glob.glob(os.path.join('replays', '*.gz')):
    base = os.path.basename(replay)
    uuid = base.split('_')[-1].split('.')[0]
    ip = base.split('_')[0]
    user = -1
    print (uuid, ip, user)
    if not session.query(exists().where(User.id == -1)).scalar():
        u = User(id=-1, name='Undefined', password='')
        session.add(u)
        session.commit()

    if not session.query(exists().where(Model.model_hash == '0')).scalar():
        u = Model(model_hash='0')
        session.add(u)
        session.commit()
    if not session.query(exists().where(Replay.uuid == uuid)).scalar():
        r = Replay(uuid=uuid, ip=ip, user=user, model_hash='0', num_team0=1, num_players=1, is_eval=False)
        session.add(r)
        print('Added', uuid, ip, user)
session.commit()

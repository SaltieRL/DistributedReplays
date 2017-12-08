import glob

import os
from sqlalchemy import create_engine, exists
from sqlalchemy.orm import sessionmaker

import config
from objects import Base, User, Replay


connection_string = 'mysql://{}:{}@localhost/saltie'.format(config.db_user, config.db_password)
print (connection_string)
engine = create_engine(connection_string, echo=True)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)

session = Session()

for replay in glob.glob(os.path.join('replays', '*.gz')):
    base = os.path.basename(replay)
    uuid = base.split('_')[-1].split('.')[0]
    ip = base.split('_')[0]
    user = -1
    print (uuid, ip, user)
    if not session.query(exists().where(Replay.uuid == uuid)).scalar():
        r = Replay(uuid=uuid, ip=ip, user=user, model_hash='', num_team0=1, num_players=1)
        session.add(r)
        print('Added', uuid, ip, user)
session.commit()
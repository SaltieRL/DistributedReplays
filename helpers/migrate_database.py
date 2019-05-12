import os
import sys
sys.path.append(os.path.abspath('.'))
from backend.database.startup import startup


def clear_database(sess):
    s = sess()
    s.execute('DROP TABLE GAMES CASCADE;')
    s.execute('DROP TABLE PLAYERGAMES CASCADE;')
    s.commit()
    s.close()


if __name__ == '__main__':
    engine, Session = startup()
    clear_database(Session)

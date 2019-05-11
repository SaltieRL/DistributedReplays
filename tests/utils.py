import ctypes
import inspect
import os
import tempfile
import threading

import requests
from carball import analyze_replay_file

from backend.database import startup
from backend.database.utils.utils import add_objects

folder_location = os.path.join(os.path.dirname(__file__), 'test_data')


def get_test_folder():
    return folder_location


def get_test_file(file_name):
    return os.path.join(folder_location, file_name)


def download_replay_discord(url):
    file = requests.get(url, stream=True)
    replay = file.raw
    return replay.data


def initialize_db():
    engine, sessionmaker = startup.startup()
    session = sessionmaker()
    _, path = tempfile.mkstemp()
    return session


def parse_file(replay):
    replay_name = write_files_to_disk([replay])[0]
    replay = analyze_replay_file(os.path.join(folder_location, replay_name),
                                 os.path.join(folder_location, replay_name) + '.json')
    proto = replay.protobuf_game
    guid = proto.game_metadata.match_guid
    return replay, proto, guid


def initialize_db_with_replays(replay_list, session=None):
    if session is None:
        session = initialize_db()
    guids = []
    protos = []
    for replay in replay_list:
        replay, proto, guid = parse_file(replay)
        add_objects(proto, session=session)
        guids.append(guid)
        protos.append(proto)
    return session, protos, guids


def get_complex_replay_list():
    """
    For full replays that have crashed or failed to be converted
    :return:
    """
    return [
        'https://cdn.discordapp.com/attachments/493849514680254468/501630263881760798/OCE_RLCS_7_CARS.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/497149910999891969/NEGATIVE_WASTED_COLLECTION.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/496153554977816576/BOTS_JOINING_AND_LEAVING.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/496153569981104129/BOTS_NO_POSITION.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/496153605074845734/ZEROED_STATS.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/496180938968137749/FAKE_BOTS_SkyBot.replay',
        'https://cdn.discordapp.com/attachments/493849514680254468/497191273619259393/WASTED_BOOST_WHILE_SUPER_SONIC.replay',
    ]


def write_files_to_disk(replays):
    if not os.path.exists(folder_location):
        os.mkdir(folder_location)
    file_names = []
    for replay_url in replays:
        print('Testing:', replay_url)
        file_name = replay_url[replay_url.rfind('/') + 1:]
        file_names.append(file_name)
        f = download_replay_discord(replay_url)
        with open(os.path.join(folder_location, file_name), 'wb') as real_file:
            real_file.write(f)
    return file_names

def clear_dir():
    try:
        os.remove(folder_location)
    except:
        pass
    for root, dirs, files in os.walk(folder_location):
        for file in files:
            try:
                os.remove(file)
            except:
                pass

def _async_raise(tid, exctype):
    '''Raises an exception in the threads with id tid'''
    if not inspect.isclass(exctype):
        raise TypeError("Only types can be raised (not instances)")
    res = ctypes.pythonapi.PyThreadState_SetAsyncExc(ctypes.c_long(tid),
                                                     ctypes.py_object(exctype))
    if res == 0:
        raise ValueError("invalid thread id")
    elif res != 1:
        # "if it returns a number greater than one, you're in trouble,
        # and you should call it again with exc=NULL to revert the effect"
        ctypes.pythonapi.PyThreadState_SetAsyncExc(ctypes.c_long(tid), None)
        raise SystemError("PyThreadState_SetAsyncExc failed")

# https://stackoverflow.com/questions/323972/is-there-any-way-to-kill-a-thread
class KillableThread(threading.Thread):
    '''A thread class that supports raising exception in the thread from
       another thread.
    '''
    def _get_my_tid(self):
        """determines this (self's) thread id

        CAREFUL : this function is executed in the context of the caller
        thread, to get the identity of the thread represented by this
        instance.
        """
        if not self.isAlive():
            raise threading.ThreadError("the thread is not active")

        # do we have it cached?
        if hasattr(self, "_thread_id"):
            return self._thread_id

        # no, look for it in the _active dict
        for tid, tobj in threading._active.items():
            if tobj is self:
                self._thread_id = tid
                return tid

        raise AssertionError("could not determine the thread's id")

    def raise_exc(self, exctype):
        """Raises the given exception type in the context of this thread.

        If the thread is busy in a system call (time.sleep(),
        socket.accept(), ...), the exception is simply ignored.

        If you are sure that your exception should terminate the thread,
        one way to ensure that it works is:

            t = ThreadWithExc( ... )
            ...
            t.raiseExc( SomeException )
            while t.isAlive():
                time.sleep( 0.1 )
                t.raiseExc( SomeException )

        If the exception is to be caught by the thread, you need a way to
        check that your thread has caught it.

        CAREFUL : this function is executed in the context of the
        caller thread, to raise an excpetion in the context of the
        thread represented by this instance.
        """
        _async_raise( self._get_my_tid(), exctype )


    def terminate(self):
        self.raise_exc(SystemExit)

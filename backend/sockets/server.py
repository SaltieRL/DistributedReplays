import datetime
import json

import eventlet.wsgi
import socketio

sio = socketio.Server(cors_allowed_origins='*')
app = socketio.WSGIApp(sio)

participants = {}


def write_log(s):
    print(s)
    with open('logfile.out', 'a+') as f:
        f.write('time: %s Action: %s \n' % (str(datetime.datetime.now()), s))


def get_json(sid, data):
    return json.dumps({
        'data': data,
        'sid': sid
    })


@sio.on('message', namespace='/')
def message(sid, data):
    write_log("Message from %s" % sid)
    sio.emit('message', data=get_json(sid, data))


@sio.on('connect', namespace='/')
def connect(sid, data):
    write_log("Connection from %s" % sid)
    sio.emit('sid', data=sid)
    write_log("Sent id to %s" % sid)


@sio.on('disconnect', namespace='/')
def disconnect(sid):
    write_log("Disconnect message from %s" % sid)
    for room, clients in participants.items():
        try:
            clients.remove(sid)
            write_log("Removed %s from %s \n list of left participants is %s" % (sid, room, clients))
        except ValueError:
            write_log("Remove %s from %s \n list of left participants is %s has failed" % (sid, room, clients))


@sio.on('create or join', namespace='/')
def create_or_join(sid, data):
    sio.enter_room(sid, data)
    try:
        participants[data].append(sid)
    except KeyError:
        participants[data] = [sid]
    num_clients = len(participants[data])
    if num_clients == 1:
        sio.emit('created', data)
    elif num_clients > 2:
        sio.emit('full')
    elif num_clients == 2:
        sio.emit('joined')
        sio.emit('join')
    print(sid, data, len(participants[data]))


if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 843)), app)

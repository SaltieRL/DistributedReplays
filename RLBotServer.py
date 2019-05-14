from backend.initial_setup import CalculatedServer

app = None

def start_server():
    global app
    server = CalculatedServer()
    app = server.app
    server.app.run(host='0.0.0.0', port=8000)


if __name__ == '__main__':
    start_server()

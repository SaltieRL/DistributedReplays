app = None


def start_app():
    from backend.initial_setup import CalculatedServer
    global app
    server = CalculatedServer()
    app = server.app
    return server


def start_server():
    server = start_app()
    server.app.run(host='0.0.0.0', port=8000)


if __name__ == '__main__':
    start_server()

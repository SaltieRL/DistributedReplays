from celery import Task
from werkzeug.wsgi import LimitedStream

from backend.database.startup import lazy_startup


class StreamConsumingMiddleware(object):

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        stream = LimitedStream(environ['wsgi.input'],
                               512 * 1024 * 1024)
        environ['wsgi.input'] = stream
        app_iter = self.app(environ, start_response)
        try:
            stream.exhaust()
            for event in app_iter:
                yield event
        finally:
            if hasattr(app_iter, 'close'):
                app_iter.close()


class DBTask(Task):
    _session = None

    # def after_return(self, *args, **kwargs):
    #     if self._session is not None:
    #         self._session.remove()

    @property
    def session(self):
        if self._session is None:
            self._session = lazy_startup()
        return self._session

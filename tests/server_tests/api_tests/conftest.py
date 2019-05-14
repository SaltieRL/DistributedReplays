import io

import pytest
from werkzeug.wrappers import Response, Request


class TestClient:
    def __init__(self, app):
        self.app = app

    def get_function_type(self, request: Request):
        if request.method == "POST":
            return self.app.post

    def send(self, request: Request) -> Response:

        call = self.get_function_type(request)

        # build it
        prepped = request.prepare()

        # extract data needed for content
        content_data = list(prepped.headers._store.items())
        content_length = content_data[0][1][1]
        if int(content_length) > 0:
            content_type = content_data[1][1][1]

            # add the body as an input stream and use the existing values
            return call(prepped.path_url, input_stream=io.BytesIO(prepped.body),
                                 content_length=content_length, content_type=content_type)
        else:
            return call(prepped.path_url)



@pytest.fixture()
def test_client(app) -> TestClient:
    return TestClient(app)

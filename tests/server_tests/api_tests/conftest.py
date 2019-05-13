import io

import pytest
from werkzeug.wrappers import Response


class TestClient:
    def __init__(self, app):
        self.app = app

    def send(self, request) -> Response:
        # build it
        prepped = request.prepare()

        # extract data needed for content
        content_data = list(prepped.headers._store.items())
        content_length = content_data[0][1][1]
        content_type = content_data[1][1][1]

        # add the body as an input stream and use the existing values
        return self.app.post('/api/upload', input_stream=io.BytesIO(prepped.body),
                             content_length=content_length, content_type=content_type)


@pytest.fixture()
def test_client(app) -> TestClient:
    return TestClient(app)

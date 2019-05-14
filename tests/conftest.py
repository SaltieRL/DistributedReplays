import pytest

@pytest.fixture(autouse=True)
def temp_folder(tmpdir, monkeypatch):

    path = tmpdir.dirname
    return path

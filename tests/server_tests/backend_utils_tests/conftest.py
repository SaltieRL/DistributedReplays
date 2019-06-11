import os

import pytest


@pytest.fixture()
def mock_bracket(requests_mock):
    from backend.utils.braacket_connection import Braacket
    html_file = open(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'RLBot_Player.html'), 'r').read()
    requests_mock.get('https://braacket.com/league/'
                      f'{Braacket().league}/player?rows=200', text=html_file)

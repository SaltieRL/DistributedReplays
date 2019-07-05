import os

import pytest


@pytest.fixture()
def mock_bracket(requests_mock):
    from backend.utils.braacket_connection import Braacket
    player_html_file = open(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'RLBot_Player.html'), 'r').read()
    requests_mock.get('https://braacket.com/league/'
                      f'{Braacket().league}/player?rows=200', text=player_html_file)

    requests_mock.get('https://braacket.com/league/rlbot/player/notABot', text=player_html_file)

    skybot_html_file = open(os.path.join(os.path.dirname(os.path.realpath(__file__)),
                                         'RLBot_Player_SkyBot.html'), 'r').read()
    uuid = '54FB8C16-6FA9-4C4A-AAD5-3DB8A6AE169B'
    requests_mock.get(
        'https://braacket.com/league/'
        f'{Braacket().league}/player/{uuid}', text=skybot_html_file)

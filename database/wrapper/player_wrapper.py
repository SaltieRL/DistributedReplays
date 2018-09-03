import logging

from sqlalchemy import func
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

from database.objects import Player

logger = logging.getLogger(__name__)


def create_default_player():
    player = Player()
    player.platformid = 3678
    player.platformname = 'test user'
    player.avatar = "https://i.ytimg.com/vi/rziIg5V1RdA/maxresdefault.jpg"

    return player


def get_random_player(session):
    try:
        player = session.query(Player).one()
    except MultipleResultsFound as e:
        logger.warning(e)
        player = session.query(Player).order_by(func.random()).limit(1).first()
    except NoResultFound as e:
        logger.warning(e)
        player = create_default_player()
    return player

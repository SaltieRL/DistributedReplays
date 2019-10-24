import logging

from backend.utils.rlgarage_handler import RLGarageAPI

logger = logging.getLogger(__name__)


def get_car(index: int) -> str:
    try:
        return RLGarageAPI().get_item(index)['name']
    except KeyError:
        logger.warning(f"Could not find car: {index}.")
        return "Unknown"
    except:
        logger.warning(f"Error getting car for index {index}")
        return "Unknown"

from backend.utils.psyonix_api_handler import get_rank_batch


def get_rank(steam_id):
    """
    Gets a single rank of a given steam id. Just calls get_rank_batch with a single id.

    :param steam_id: steamid to get
    :return: rank, if it exists
    """
    rank = get_rank_batch([steam_id])
    if rank is None or len(rank) <= 0:
        return None
    return rank[list(rank.keys())[0]]


def get_rank_number(rank):
    if rank is not None:
        try:
            return rank[3]['tier']
        except IndexError:
            return rank[1]['tier']
    else:
        return 0

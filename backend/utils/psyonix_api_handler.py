import json
import logging
import os
import random
from typing import Union

import redis
import requests
from flask import current_app

fake_data = False
try:
    from config import RL_API_KEY
except ImportError:
    RL_API_KEY = None
    fake_data = True

json_loc = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'data', 'categorized_items.json')
with open(json_loc, 'r') as f:
    item_dict = json.load(f)

logger = logging.getLogger(__name__)


def get_item_name_by_id(id_: str):
    try:
        return item_dict[id_]["LongLabel"]
    except KeyError:
        logger.warning(f'Cannot find item for id {id_}. Returning "Unknown"')
        return "Unknown"


def get_item_dict():
    return item_dict


def get_rank_batch(ids, offline_redis=None, use_redis=True):
    """
    Gets a batch of ranks based on ids. Returns fake data if there is no API key available.

    :param ids: ids to get from RLAPI
    :param offline_redis: Redis to use if not in the application context
    :return: rank information
    """
    rank_datas_for_players = {}
    if fake_data or RL_API_KEY is None:
        return make_fake_data(ids)
    try:
        r = current_app.config['r']  # type: redis.Redis
    except KeyError:
        r = None
        ids_to_find = ids
    except RuntimeError:  # we're not in application context, use our own redis
        if offline_redis is None and use_redis:
            offline_redis = redis.Redis(
                host='localhost',
                port=6379)
        r = offline_redis
    if r is not None:
        ids_to_find = []
        for steam_id in ids:
            try:
                result = r.get(steam_id)
            except redis.ConnectionError:
                logger.error('Error connecting to redis')
                r = None
                ids_to_find = ids
                break
            if result is not None:
                # logger.debug('Rank is cached')
                rank_datas_for_players[steam_id] = json.loads(result.decode("utf-8"))
            elif steam_id != '0':
                ids_to_find.append(steam_id)
            else:
                rank_datas_for_players['0'] = {}
        if len(ids_to_find) == 0:
            return rank_datas_for_players
        else:
            logger.debug(ids_to_find)
    else:
        ids_to_find = ids
    url = "https://api.rocketleague.com/api/v1/steam/playerskills/"
    headers = {'Authorization': f'Token {RL_API_KEY}', 'Referer': 'http://api.rocketleague.com'}

    ids_dict = list(
        filter(lambda x: x['platformId'] == 'steam',
               [{'platformId': get_platform_id(i), 'uniqueId': i} for i in ids_to_find]))
    post_data = {'player_ids': [p['uniqueId'] for p in ids_dict]}
    data = requests.post(url, headers=headers, json=post_data)
    if data.status_code >= 300:
        return {**rank_datas_for_players, **get_empty_data(ids_to_find)}
    try:
        data = data.json()
    except Exception as e:
        print(e)
        return get_empty_data(ids)
    if 'detail' in data:
        return {str(i): {} for i in ids}
    for player in data:
        rank_datas = {}
        unique_id = player['user_id']
        names = {'13': 'standard', '11': 'doubles', '10': 'duel', '12': 'solo',
                 '27': 'hoops', '28': 'rumble', '29': 'dropshot', '30': 'snowday'}
        if 'player_skills' in player:
            found_modes = []
            for playlist in player['player_skills']:
                if 'tier' in playlist and str(playlist['playlist']) in names:  # excludes unranked
                    mode = names[str(playlist['playlist'])]
                    found_modes.append(mode)
                    rank_data = {'mode': mode, 'rank_points': playlist['skill'],
                                 'tier': playlist['tier'],
                                 'division': playlist['division'],
                                 'string': tier_div_to_string(playlist['tier'], playlist['division'])}
                    rank_datas[str(playlist['playlist'])] = rank_data

            for idx, mode in names.items():
                if mode not in found_modes:
                    rank_datas[idx] = {
                        'mode': mode, 'rank_points': 0,
                        'tier': 0,
                        'division': 0,
                        'string': tier_div_to_string(None)
                    }

            if r is not None:
                r.set(unique_id, json.dumps(rank_datas), ex=30 * 60)
            rank_datas_for_players[unique_id] = rank_datas
        else:
            rank_datas_for_players[unique_id] = {}
    return rank_datas_for_players


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


def make_fake_data(ids):
    """
    Makes fake rank information.

    :param ids: ids to make information for
    :return: fake rank data
    """
    base_rank = random.randint(3, 17)
    return {
        id_: get_formatted_rank_data(base_rank + random.randint(-2, 2), random.randint(0, 4))
        for id_ in ids
    }


def get_empty_data(ids):
    return {id_: get_formatted_rank_data(rank=0, div=0) for id_ in ids}


def get_formatted_rank_data(rank, div):
    modes = {'13': 'standard', '11': 'doubles', '10': 'duel', '12': 'solo'}
    return {
        id_:
            {'mode': mode,
             'rank_points': rank * random.randint(60, 75) + 15 * div,
             'tier': rank,
             'division': div,
             'string': tier_div_to_string(rank, div)}
        for id_, mode in modes.items()
    }


def tier_div_to_string(rank: Union[int, None], div: int = -1):
    """
    Converts rank and division to a fancy string.

    :param rank: integer rank (0-19)
    :param div: division (0-3), -1 to omit
    :return: Rank string
    """
    ranks = ['Unranked', 'Bronze I', 'Bronze II', 'Bronze III', 'Silver I', 'Silver II', 'Silver III', 'Gold I',
             'Gold II', 'Gold III', 'Platinum I', 'Platinum II', 'Platinum III', 'Diamond I', 'Diamond II',
             'Diamond III', 'Champion I', 'Champion II', 'Champion III', 'Grand Champion']
    if rank is None:
        logger.debug(rank)
        logger.debug(div)
        return 'Unknown'
    if rank == 19:
        return f"{ranks[rank]}"
    if rank < 19 and div >= 0:
        return f"{ranks[rank]} (div {div + 1})"


def get_platform_id(i):
    if len(str(i)) == 17:
        return 'steam'  # steam
    else:
        return '-1'


if __name__ == '__main__':
    print(get_rank_batch(['76561198374703623'], use_redis=False))

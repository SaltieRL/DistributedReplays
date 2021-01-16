import json
import logging
import random
from typing import Union

import redis
import requests

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Player
from backend.database.startup import get_current_session
from backend.utils.braacket_connection import Braacket
from backend.utils.safe_flask_globals import get_redis

fake_data = False
try:
    from config import RL_API_KEY
except ImportError:
    RL_API_KEY = None
    fake_data = True

logger = logging.getLogger(__name__)


def get_bot_by_steam_id(steam_id):
    if steam_id[0] == 'b' and steam_id[-1] == 'b':
        if len(steam_id) < 6:
            return "Allstar"
        else:
            session = get_current_session()
            bot = session.query(Player).filter(Player.platformid == steam_id).first()
            session.close()
            if bot is None:
                return None
        return bot.platformname
    return None


def get_rank_batch(ids, name_map=None, offline_redis=None, use_redis=True):
    """
    Gets a batch of ranks based on ids. Returns fake data if there is no API key available.

    :param ids: ids to get from RLAPI
    :param offline_redis: Redis to use if not in the application context
    :return: rank information
    """
    inverted_name_map = None
    if name_map is not None:
        inverted_name_map = {v: k for k, v in name_map.items()}
    rank_datas_for_players = {}
    if fake_data or RL_API_KEY is None:
        return make_fake_data(ids)
    _redis = None
    if use_redis:
        try:
            _redis = get_redis()
        except KeyError:
            _redis = None
        except RuntimeError:  # we're not in application context, use our own redis
            if offline_redis is None and use_redis:
                offline_redis = redis.Redis(
                    host='localhost',
                    port=6379)
            _redis = offline_redis
    if _redis is not None:
        ids_to_find = []
        for steam_id in ids:
            try:
                result = _redis.get(steam_id)
            except redis.ConnectionError:
                logger.error('Error connecting to redis')
                _redis = None
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

    headers = {'Authorization': f'Token {RL_API_KEY}', 'Referer': 'http://api.rocketleague.com'}
    for platform_cat in ['steam', 'xboxone', 'ps4']:
        ids_list = list(
            filter(lambda i: get_platform_id(i) == platform_cat,
                   ids_to_find))
        if len(ids_list) == 0:
            continue
        if platform_cat != 'steam':
            ids_list = [name_map[i] for i in ids_list]
        ids_dict = [{'platformId': get_platform_id(i), 'uniqueId': i} for i in ids_list]
        if len(ids_dict) == 0:
            continue
        url = f"https://api.rocketleague.com/api/v1/{platform_cat}/playerskills/"
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
            if platform_cat == 'steam':
                unique_id = player['user_id']
            else:
                unique_id = inverted_name_map[player['user_name']]
            names = {'13': 'standard', '11': 'doubles', '10': 'duel',
                     '27': 'hoops', '28': 'rumble', '29': 'dropshot', '30': 'snowday', '34': 'tournament'}
            if 'player_skills' in player:
                found_modes = []
                for playlist in player['player_skills']:
                    if 'tier' in playlist and str(playlist['playlist']) in names:  # excludes unranked
                        mode = names[str(playlist['playlist'])]
                        found_modes.append(mode)
                        rank_data = {'mode': mode, 'rank_points': playlist['skill'],
                                     'tier': playlist['tier'],
                                     'division': playlist['division'],
                                     'string': tier_div_to_string(playlist['tier'], playlist['division']),
                                     'streak': playlist['win_streak'] if 'win_streak' in playlist else 0}
                        rank_datas[str(playlist['playlist'])] = rank_data

                for idx, mode in names.items():
                    if mode not in found_modes:
                        rank_datas[idx] = {
                            'mode': mode, 'rank_points': 0,
                            'tier': 0,
                            'division': 0,
                            'string': tier_div_to_string(None)
                        }

                if _redis is not None:
                    _redis.set(platform_cat + '_' + unique_id, json.dumps(rank_datas), ex=2 * 60)
                rank_datas_for_players[unique_id] = rank_datas
            else:
                rank_datas_for_players[unique_id] = {}
    return rank_datas_for_players


def get_rank(platform_id):
    """
    Gets a single rank of a given steam id. Just calls get_rank_batch with a single id.

    :param platform_id: platformid to get
    :param name: name for non-steam platform (unique)
    :return: rank, if it exists
    """
    bot_id = get_bot_by_steam_id(platform_id)
    if bot_id is not None:
        league = Braacket()
        league.update_player_cache()
        braacket_id = league.player_cache.get(bot_id)
        unranked = get_empty_data([platform_id])
        if braacket_id is not None:
            ranking_info = league.get_ranking(braacket_id)
            if ranking_info is not None:
                ranking_string = ranking_info[0]
                ranking_points = ranking_info[1]
                unranked.get(platform_id).get('10')['string'] = ranking_string[0] + ranking_string[1] + " " + \
                                                                ranking_string[2] + " " + ranking_string[3]
                unranked.get(platform_id).get('10')['rank_points'] = ranking_points
                rank = int(ranking_string[0])
                if rank <= 6:
                    unranked.get(platform_id).get('10')['tier'] = 31
                elif rank <= 12:
                    unranked.get(platform_id).get('10')['tier'] = 32
                elif rank <= 18:
                    unranked.get(platform_id).get('10')['tier'] = 33
                elif rank <= 24:
                    unranked.get(platform_id).get('10')['tier'] = 34
                else:
                    unranked.get(platform_id).get('10')['tier'] = 35
        return unranked[list(unranked.keys())[0]]

    name = None
    if get_platform_id(platform_id) != 'steam':
        name = get_name_for_id(platform_id)
    if name is not None:
        rank = get_rank_batch([platform_id], name_map={platform_id: name})
    else:
        rank = get_rank_batch([platform_id])
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
    modes = {'13': 'standard', '11': 'doubles', '10': 'duel'}
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
             'Diamond III', 'Champion I', 'Champion II', 'Champion III', 'Grand Champion I', 'Grand Champion II',
             'Grand Champion III', 'Supersonic Legend']
    if rank is None:
        logger.debug(rank)
        logger.debug(div)
        return 'Unknown'
    if rank == 22:
        return f"{ranks[rank]}"
    if rank < 22 and div >= 0:
        return f"{ranks[rank]} (div {div + 1})"


def get_platform_id(i):
    # 17 = steam
    # 19 (2408525525800179677) = ps4 (need name, not ID)
    # 16 (2535458828415363) = xboxone (need name, not ID)
    if len(str(i)) == 17:
        return 'steam'  # steam
    elif len(str(i)) == 19:
        return 'ps4'
    elif len(str(i)) == 16:
        return 'xboxone'
    else:
        return '-1'

@with_session
def get_name_for_id(platformid, session=None):
    return session.query(Player).filter(Player.platformid == platformid).first().platformname


if __name__ == '__main__':
    print(get_rank_batch(['76561198374703623'], use_redis=False))
    print(get_rank_batch(['76561198374703623', '2408525525800179677'], name_map={'2408525525800179677': 'ChiengBang'}, use_redis=False))
    # print(get_rank_batch(['2533274918009209'], use_redis=False))

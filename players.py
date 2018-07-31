import json
import time

import redis
import requests
from config import RLSTATS_API_KEY
from objects import Game
from steam import steam_id_to_profile

from flask import render_template, Blueprint, current_app

bp = Blueprint('players', __name__, url_prefix='/players')


@bp.route('/view/<id_>')
def view_player(id_):
    session = current_app.config['db']()
    rank = get_rank(id_)
    games = session.query(Game).filter(Game.players.any(str(id_))).all()
    steam_profile = steam_id_to_profile(id_)
    if steam_profile is None:
        return render_template('error.html', error="Unable to find the requested profile")
    return render_template('player.html', games=games, rank=rank, profile=steam_profile)


rank_cache = {}


def get_rank(steam_id):
    if len(str(steam_id)) < 17:
        return {}
    try:
        r = current_app.config['r']  # type: redis.Redis
        print('successfully found redis')
        result = r.get(steam_id)
        print(result)
        if result is not None:
            return json.loads(result.decode("utf-8"))
    except KeyError:
        r = None
    url = "https://api.rocketleaguestats.com/v1/player?unique_id={}&platform_id=1".format(steam_id)
    post_data = {'Authorization': RLSTATS_API_KEY}
    data = requests.get(url, headers=post_data)
    data = data.json()
    # print (data)
    if 'rankedSeasons' in data:
        seasons = {}
        for k in data['rankedSeasons']:
            season = data['rankedSeasons'][k]
            modes = []

            names = {'13': 'standard', '11': 'doubles', '10': 'duel', '12': 'solo'}
            for t in season:
                if 'tier' in season[t]:  # excludes unranked
                    s = {'mode': names[t], 'rank_points': season[t]['rankPoints'], 'tier': season[t]['tier'],
                         'division': season[t]['division'],
                         'string': tier_div_to_string(season[t]['tier'], season[t]['division'])}
                    modes.append(s)
                else:
                    s = {'mode': names[t], 'rank_points': season[t]['rankPoints'], 'tier': 0,
                         'division': 0, 'string': tier_div_to_string(0, 0)}
                    modes.append(s)
            seasons[k] = modes

        if r is not None:
            r.set(steam_id, json.dumps(seasons), ex=24 * 60 * 60)
        return seasons
    else:
        return {}


def get_rank_batch(ids, offline_redis=None):
    return_data = {}
    try:
        r = current_app.config['r']  # type: redis.Redis
    except KeyError:
        r = None
        ids_to_find = ids
    except RuntimeError:  # we're not in application context, use our own redis
        if offline_redis is None:
            offline_redis = redis.Redis(
                host='localhost',
                port=6379)
        r = offline_redis
    if r is not None:
        print('successfully found redis')
        ids_to_find = []
        for steam_id in ids:
            result = r.get(steam_id)
            if result is not None:
                print('Rank is cached')
                return_data[steam_id] = json.loads(result.decode("utf-8"))
            else:
                ids_to_find.append(steam_id)
    url = "https://api.rocketleaguestats.com/v1/player/batch"
    headers = {'Authorization': RLSTATS_API_KEY}

    post_data = list(
        filter(lambda x: x['platformId'] == '1',
               [{'platformId': get_platform_id(i), 'uniqueId': str(i)} for i in ids_to_find]))
    data = requests.post(url, headers=headers, json=post_data)
    data = data.json()
    if 'code' in data:
        if data['code'] == 400:
            print('invalid request')
            print(post_data)
            return {}
        print(data)
        print('API call exceeded')
        time.sleep(5)
        return get_rank_batch(ids, offline_redis=offline_redis)

    # return data
    print(data)
    for player in data:
        unique_id = player['uniqueId']
        if 'rankedSeasons' in player:
            seasons = {}
            for k in player['rankedSeasons']:
                season = player['rankedSeasons'][k]
                modes = []

                names = {'13': 'standard', '11': 'doubles', '10': 'duel', '12': 'solo'}
                for t in season:
                    if 'tier' in season[t]:  # excludes unranked
                        s = {'mode': names[t], 'rank_points': season[t]['rankPoints'], 'tier': season[t]['tier'],
                             'division': season[t]['division'],
                             'string': tier_div_to_string(season[t]['tier'], season[t]['division'])}
                        modes.append(s)
                    else:
                        s = {'mode': names[t], 'rank_points': season[t]['rankPoints'], 'tier': 0,
                             'division': 0, 'string': tier_div_to_string(0, 0)}
                        modes.append(s)
                seasons[k] = modes
            if r is not None:
                r.set(unique_id, json.dumps(seasons), ex=24 * 60 * 60)
            return_data[unique_id] = seasons
        else:
            return_data[unique_id] = {}
    return return_data


def tier_div_to_string(rank: int, div: int = -1):
    """
    Converts rank and division to a fancy string.

    :param rank: integer rank (0-19)
    :param div: division (0-3), -1 to omit
    :return: Rank string
    """
    ranks = ['Unranked', 'Bronze I', 'Bronze II', 'Bronze III', 'Silver I', 'Silver II', 'Silver III', 'Gold I',
             'Gold II', 'Gold III', 'Platinum I', 'Platinum II', 'Platinum III', 'Diamond I', 'Diamond II',
             'Diamond III', 'Champion I', 'Champion II', 'Champion III', 'Grand Champion']
    if rank < 19 and div > 0:
        return "{}, Division {}".format(ranks[rank], div + 1)
    else:
        return ranks[rank]


def get_platform_id(i):
    if len(str(i)) == 17:
        return '1'  # steam
    else:
        return '-1'

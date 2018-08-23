import json
import random
import re
from typing import List

import redis
import requests
from sqlalchemy import func, desc, case

from data import constants

from database.objects import PlayerGame, Game
from blueprints.steam import steam_id_to_profile, vanity_to_steam_id

from flask import render_template, Blueprint, current_app, redirect, url_for, jsonify

fake_data = False
try:
    from config import RL_API_KEY
except ImportError:
    RL_API_KEY = None
    fake_data = True
bp = Blueprint('players', __name__, url_prefix='/players')
regex = re.compile('[0-9]{17}')


@bp.route('/overview/<id_>')  # ID must be always at the end
def view_player(id_):
    print(re.match(regex, id_))
    if len(id_) != 17 or re.match(regex, id_) is None:
        r = vanity_to_steam_id(id_)
        if r is None:
            return redirect(url_for('home'))
        id_ = r['response']['steamid']
        return redirect(url_for('players.view_player', id_=id_))
    session = current_app.config['db']()
    rank = get_rank(id_)
    games = session.query(PlayerGame).filter(PlayerGame.player == id_).filter(
        PlayerGame.game != None).all()  # type: List[PlayerGame]
    stats_query = func.avg(PlayerGame.score), func.avg(PlayerGame.goals), func.avg(PlayerGame.assists), \
                  func.avg(PlayerGame.saves), func.avg(PlayerGame.shots), func.avg(PlayerGame.a_possession), \
                  func.avg(PlayerGame.a_hits - PlayerGame.a_dribble_conts), \
                  func.avg((100 * PlayerGame.shots) / (PlayerGame.a_hits - PlayerGame.a_dribble_conts)), \
                  func.avg((100 * PlayerGame.a_passes) / (PlayerGame.a_hits - PlayerGame.a_dribble_conts)), \
                  func.avg((100 * PlayerGame.assists) / (PlayerGame.a_hits - PlayerGame.a_dribble_conts))
    if len(games) > 0:
        fav_car_str = session.query(PlayerGame.car, func.count(PlayerGame.car).label('c')).filter(
            PlayerGame.player == id_).filter(
            PlayerGame.game != None).group_by(PlayerGame.car).order_by(desc('c')).first()
        print(fav_car_str)
        # car_arr = [g.car for g in games]
        favorite_car = constants.cars[int(fav_car_str[0])]
        favorite_car_pctg = fav_car_str[1] / len(games)
        q = session.query(*stats_query).filter(PlayerGame.a_hits > 0)
        global_stats = q.first()
        stats = list(q.filter(PlayerGame.player == id_).first())
        print(stats)
        for i, s in enumerate(stats):
            if s is None:
                stats[i] = 0
        stats = [s / g for s, g in zip(stats, global_stats)]
    else:
        favorite_car = "Unknown"
        favorite_car_pctg = 0.0
        stats = [0.0] * len(stats_query)

    steam_profile = steam_id_to_profile(id_)
    if steam_profile is None:
        return render_template('error.html', error="Unable to find the requested profile")
    return render_template('player.html', games=games, rank=rank, profile=steam_profile, car=favorite_car,
                           favorite_car_pctg=favorite_car_pctg, stats=stats)


@bp.route('/compare/<id1>/<id2>')
def compare_player(id1, id2):
    session = current_app.config['db']()
    q = session.query(Game.hash).filter(Game.players.op('@>')('{\'%s\', \'%s\'}' % (id1, id2)))
    print(str(q))
    common_games = q.all()
    return jsonify([url_for('replays.view_replay', id_=h) for h in common_games])


rank_cache = {}


def get_rank(steam_id):
    rank = get_rank_batch([steam_id])
    return rank[list(rank.keys())[0]]


def make_fake_data(ids):
    names = {'13': 'standard', '11': 'doubles', '10': 'duel', '12': 'solo'}
    base_rank = random.randint(3, 17)
    return_data = {}
    for id_ in ids:
        modes = []
        for mode in names.values():
            rank = base_rank + random.randint(-2, 2)
            div = random.randint(0, 4)
            s = {'mode': mode, 'rank_points': rank * random.randint(60, 75) + 15 * div,
                 'tier': rank,
                 'division': div,
                 'string': tier_div_to_string(rank, div)}
            modes.append(s)
        return_data[id_] = modes
    return return_data


def get_rank_batch(ids, offline_redis=None):
    return_data = {}
    if fake_data:
        return make_fake_data(ids)
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
        ids_to_find = []
        for steam_id in ids:
            try:
                result = r.get(steam_id)
            except redis.ConnectionError:
                print('error connecting to redis')
                r = None
                ids_to_find = ids
                break
            if result is not None:
                # print('Rank is cached')
                return_data[steam_id] = json.loads(result.decode("utf-8"))
            elif steam_id != '0':
                ids_to_find.append(steam_id)
            else:
                return_data['0'] = {}
        if len(ids_to_find) == 0:
            return return_data
        else:
            print(ids_to_find)
    url = "https://api.rocketleague.com/api/v1/steam/playerskills/"
    headers = {'Authorization': 'Token ' + RL_API_KEY, 'Referer': 'http://api.rocketleague.com'}

    ids_dict = list(
        filter(lambda x: x['platformId'] == 'steam',
               [{'platformId': get_platform_id(i), 'uniqueId': i} for i in ids_to_find]))
    post_data = {'player_ids': [p['uniqueId'] for p in ids_dict]}
    data = requests.post(url, headers=headers, json=post_data)
    data = data.json()
    if 'detail' in data:
        return {str(i): {} for i in ids}
    for player in data:
        modes = []
        unique_id = player['user_id']
        names = {'13': 'standard', '11': 'doubles', '10': 'duel', '12': 'solo'}
        if 'player_skills' in player:

            for playlist in player['player_skills']:
                if 'tier' in playlist:  # excludes unranked
                    s = {'mode': names[str(playlist['playlist'])], 'rank_points': playlist['skill'],
                         'tier': playlist['tier'],
                         'division': playlist['division'],
                         'string': tier_div_to_string(playlist['tier'], playlist['division'])}
                    modes.append(s)
            if r is not None:
                r.set(unique_id, json.dumps(modes), ex=24 * 60 * 60)
            return_data[unique_id] = modes
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
    if rank is None:
        print(rank, div)
        return 'Unknown'
    if rank < 19 and div > 0:
        return "{}, Division {}".format(ranks[rank], div + 1)
    else:
        return ranks[rank]


def get_platform_id(i):
    if len(str(i)) == 17:
        return 'steam'  # steam
    else:
        return '-1'

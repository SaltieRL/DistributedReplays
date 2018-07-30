import redis
import requests
from config import RLSTATS_API_KEY
from objects import Game
from steam import steam_id_to_profile

from flask import render_template, Blueprint, current_app
from functions import tier_div_to_string, get_platform_id

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
    if steam_id in rank_cache:
        return rank_cache[steam_id]
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
        rank_cache[steam_id] = seasons
        return seasons
    else:
        return {}


def get_rank_batch(ids):
    return_data = {}
    try:
        r = current_app.config['r']  # type: redis.Redis
        ids_to_find = []
        for steam_id in ids:

            result = r.get(steam_id)
            if result is not None:
                return_data[steam_id] = result
            else:
                ids_to_find.append(steam_id)
    except:
        r = None
        ids_to_find = ids
    url = "https://api.rocketleaguestats.com/v1/player/batch"
    headers = {'Authorization': RLSTATS_API_KEY}

    post_data = list(
        filter(lambda x: x['platformId'] == '1',
               [{'platformId': get_platform_id(i), 'uniqueId': str(i)} for i in ids_to_find]))
    data = requests.post(url, headers=headers, json=post_data)
    data = data.json()
    # return data
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
                r.set(unique_id, seasons, ex=24 * 60 * 60)
            return_data[unique_id] = seasons
        else:
            return_data[unique_id] = {}
    return return_data

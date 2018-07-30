# Helper functions
import json
import os

import redis
import requests
import config
from flask import jsonify, render_template, current_app

# Replay stuff
from objects import Game
from replayanalysis.game.game import Game as ReplayGame

replay_dir = os.path.join(os.path.dirname(__file__), 'replays')
if not os.path.isdir(replay_dir):
    os.mkdir(replay_dir)
model_dir = os.path.join(os.path.dirname(__file__), 'models')
if not os.path.isdir(model_dir):
    os.mkdir(model_dir)

ALLOWED_EXTENSIONS = {'bin', 'gz'}
with open(os.path.join('data', 'categorized_items.json'), 'r') as f:
    item_dict = json.load(f)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def return_error(msg):
    return render_template('error.html', error=msg)
    # return jsonify({'error': msg})


def get_replay_path(uid, add_extension=True):
    return os.path.join(replay_dir, uid + ('.gz' if add_extension else ''))


rank_cache = {}


def get_rank(steam_id):
    if len(str(steam_id)) < 17:
        return {}
    if steam_id in rank_cache:
        return rank_cache[steam_id]
    url = "https://api.rocketleaguestats.com/v1/player?unique_id={}&platform_id=1".format(steam_id)
    post_data = {'Authorization': config.RLSTATS_API_KEY}
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
    headers = {'Authorization': config.RLSTATS_API_KEY}

    post_data = list(
        filter(lambda x: x['platformId'] == '1', [{'platformId': get_platform_id(i), 'uniqueId': str(i)} for i in ids_to_find]))
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


def tier_div_to_string(rank, div=-1):
    ranks = ['Unranked', 'Bronze I', 'Bronze II', 'Bronze III', 'Silver I', 'Silver II', 'Silver III', 'Gold I',
             'Gold II', 'Gold III', 'Platinum I', 'Platinum II', 'Platinum III', 'Diamond I', 'Diamond II',
             'Diamond III', 'Champion I', 'Champion II', 'Champion III', 'Grand Champion']
    if rank < 19 and div > 0:
        return "{}, Division {}".format(ranks[rank], div + 1)
    else:
        return ranks[rank]


def get_item_name_by_id(id_):
    return item_dict[id_]


def get_item_dict():
    return item_dict


def get_platform_id(i):
    if len(str(i)) == 17:
        return '1'  # steam
    else:
        return '-1'


def convert_pickle_to_db(game: ReplayGame) -> Game:
    ranks = get_rank_batch([p.online_id for p in game.players])
    # ranks = {p.online_id: get_rank(p.online_id) for p in g.players}
    if len(game.players) > 4:
        mode = 'standard'
    elif len(game.players) > 2:
        mode = 'doubles'
    else:
        mode = 'duel'
    rank_list = []
    mmr_list = []
    for k in ranks:
        keys = ranks[k].keys()
        if len(keys) > 0:
            latest = sorted(keys, reverse=True)[0]
            r = list(filter(lambda x: x['mode'] == mode, ranks[k][latest]))[0]
            if 'tier' in r:
                rank_list.append(r['tier'])
            if 'rank_points' in r:
                mmr_list.append(r['rank_points'])
    g = Game(hash=game.replay_id, players=[str(p.online_id) for p in g.players],
             ranks=rank_list, mmrs=mmr_list, map=game.map)
    return g

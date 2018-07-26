import requests
from config import RLSTATS_API_KEY
from objects import Game
from steam import steam_id_to_profile

from flask import render_template, Blueprint, current_app
from functions import tier_div_to_string

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

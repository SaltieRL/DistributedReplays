import re
from typing import List

from sqlalchemy import func, desc, cast, String
from sqlalchemy.dialects import postgresql

from database.objects import PlayerGame, Game
from blueprints.steam import steam_id_to_profile, vanity_to_steam_id

from flask import render_template, Blueprint, current_app, redirect, url_for, jsonify, request

from database.wrapper.stat_wrapper import PlayerStatWrapper
from helpers.functions import render_with_session, get_rank

bp = Blueprint('players', __name__, url_prefix='/players')
regex = re.compile('[0-9]{17}')

playerStatWrapper = PlayerStatWrapper()


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
    games, stats, favorite_car, favorite_car_pctg = playerStatWrapper.get_averaged_stats(id_, session)
    steam_profile = steam_id_to_profile(id_)
    if steam_profile is None:
        return render_template('error.html', error="Unable to find the requested profile")

    return render_with_session('player.html', session, games=games, rank=rank, profile=steam_profile, car=favorite_car,
                               favorite_car_pctg=favorite_car_pctg, stats=stats,
                               id=id_, get_stat_spider_charts=PlayerStatWrapper.get_stat_spider_charts)


@bp.route('/overview/<id_>/compare', methods=['POST'])
def compare_player_redir(id_):
    print(request.form)
    other = request.form['other']
    if len(other) != 17 or re.match(regex, other) is None:
        r = vanity_to_steam_id(other)
        if r is None:
            return redirect(url_for('players.view_player', id_=id_))
        other = r['response']['steamid']
    return redirect(url_for('players.compare_player', ids=",".join([id_, other])))


@bp.route('/compare/<ids>')
def compare_player(ids):
    session = current_app.config['db']()
    ids = ids.split(',')
    # q = session.query(Game.hash).filter(cast(Game.players, postgresql.ARRAY(String)).contains([id1, id2]))
    q = session.query(PlayerGame).join(Game).filter(Game.players.contains(cast(ids, postgresql.ARRAY(String)))).filter(
        PlayerGame.player == ids[0])
    # q = session.query(Game.hash).filter(Game.players.op('@>')('{\'%s\', \'%s\'}' % (id1, id2)))
    common_games = q.all()
    users = []
    for player_id in ids:
        games, stats, favorite_car, favorite_car_pctg = playerStatWrapper.get_averaged_stats(player_id, session)
        steam_profile = steam_id_to_profile(player_id)
        if steam_profile is None:
            return render_template('error.html', error="Unable to find the requested profile: " + player_id)
        user = {
            'id': player_id,
            'games': games,
            'stats': stats,
            'favorite_car': favorite_car,
            'favorite_car_pctg': favorite_car_pctg,
            'steam_profile': steam_profile
        }
        users.append(user)
    return render_with_session('compare.html', session, games=common_games, users=users,
                               get_stat_spider_charts=PlayerStatWrapper.get_stat_spider_charts)

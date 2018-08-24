import re
from typing import List

from sqlalchemy import func, desc, cast, String
from sqlalchemy.dialects import postgresql

from data import constants

from database.objects import PlayerGame, Game
from blueprints.steam import steam_id_to_profile, vanity_to_steam_id

from flask import render_template, Blueprint, current_app, redirect, url_for, jsonify, request

from helpers.functions import render_with_session, get_rank

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
    games, stats, favorite_car, favorite_car_pctg = get_stats(id_, session)
    steam_profile = steam_id_to_profile(id_)
    if steam_profile is None:
        return render_template('error.html', error="Unable to find the requested profile")

    return render_with_session('player.html', session, games=games, rank=rank, profile=steam_profile, car=favorite_car,
                               favorite_car_pctg=favorite_car_pctg, stats=stats, id=id_)


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


@bp.route('/overview/compare/<ids>')
def compare_player(ids):
    session = current_app.config['db']()
    ids = ids.split(',')
    # q = session.query(Game.hash).filter(cast(Game.players, postgresql.ARRAY(String)).contains([id1, id2]))
    q = session.query(PlayerGame).join(Game).filter(Game.players.contains(cast(ids, postgresql.ARRAY(String)))).filter(
        PlayerGame.player == ids[0])
    # q = session.query(Game.hash).filter(Game.players.op('@>')('{\'%s\', \'%s\'}' % (id1, id2)))
    common_games = q.all()
    users = []
    for p in ids:
        games, stats, favorite_car, favorite_car_pctg = get_stats(p, session)
        steam_profile = steam_id_to_profile(p)
        if steam_profile is None:
            return render_template('error.html', error="Unable to find the requested profile: " + p)
        user = {
            'id': p,
            'games': games,
            'stats': stats,
            'favorite_car': favorite_car,
            'favorite_car_pctg': favorite_car_pctg,
            'steam_profile': steam_profile
        }
        users.append(user)
    return render_with_session('compare.html', session, games=common_games, users=users)


def get_stats(id_, session):
    stats_query = get_stats_query()
    games = session.query(PlayerGame).filter(PlayerGame.player == id_).filter(
        PlayerGame.game != None).all()  # type: List[PlayerGame]
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
    return games, stats, favorite_car, favorite_car_pctg


def get_stats_query():
    q = func.avg(PlayerGame.score), func.avg(PlayerGame.goals), func.avg(PlayerGame.assists), \
        func.avg(PlayerGame.saves), func.avg(PlayerGame.shots), func.avg(PlayerGame.a_possession), \
        func.avg(PlayerGame.a_hits - PlayerGame.a_dribble_conts), \
        func.avg((100 * PlayerGame.shots) / (PlayerGame.a_hits - PlayerGame.a_dribble_conts)), \
        func.avg((100 * PlayerGame.a_passes) / (PlayerGame.a_hits - PlayerGame.a_dribble_conts)), \
        func.avg((100 * PlayerGame.assists) / (PlayerGame.a_hits - PlayerGame.a_dribble_conts)), \
        func.avg(PlayerGame.a_turnovers)
    return q

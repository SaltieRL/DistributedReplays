import re
from typing import List

from sqlalchemy import func, desc

from data import constants

from database.objects import PlayerGame, Game
from blueprints.steam import steam_id_to_profile, vanity_to_steam_id

from flask import render_template, Blueprint, current_app, redirect, url_for, jsonify

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

    return render_with_session('player.html', session, games=games, rank=rank, profile=steam_profile, car=favorite_car,
                               favorite_car_pctg=favorite_car_pctg, stats=stats)


@bp.route('/compare/<id1>/<id2>')
def compare_player(id1, id2):
    session = current_app.config['db']()
    q = session.query(Game.hash).filter(Game.players.op('@>')('{\'%s\', \'%s\'}' % (id1, id2)))
    print(str(q))
    common_games = q.all()
    session.close()
    return jsonify([url_for('replays.view_replay', id_=h) for h in common_games])




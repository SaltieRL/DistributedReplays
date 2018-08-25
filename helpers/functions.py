# Helper functions
import json
import os
import random

import redis
import requests
from flask import render_template, current_app

# Replay stuff
from database.objects import Game, PlayerGame, Player
from replayanalysis.analysis.saltie_game.saltie_game import SaltieGame as ReplayGame

try:
    from config import RL_API_KEY
except ImportError:
    RL_API_KEY = None
    fake_data = True
replay_dir = os.path.join(os.path.dirname(__file__), 'replays')
if not os.path.isdir(replay_dir):
    os.mkdir(replay_dir)
model_dir = os.path.join(os.path.dirname(__file__), 'models')
if not os.path.isdir(model_dir):
    os.mkdir(model_dir)

ALLOWED_EXTENSIONS = {'bin', 'gz'}
json_loc = os.path.join(os.path.dirname(__file__), '..', 'data', 'categorized_items.json')
with open(json_loc, 'r') as f:
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


def get_item_name_by_id(id_):
    return item_dict[id_]


def get_item_dict():
    return item_dict


def convert_pickle_to_db(game: ReplayGame, offline_redis=None) -> (Game, list, list):
    """
    Converts pickled games into various database objects.

    :param game: Pickled game to process into Database object
    :return: Game db object, PlayerGame array, Player array
    """
    teamsize = len(game.api_game.teams[0].players)
    player_objs = game.api_game.teams[0].players + game.api_game.teams[1].players
    ranks = get_rank_batch([p.id for p in player_objs], offline_redis=offline_redis)
    rank_list = []
    mmr_list = []
    gamemode = -1
    if teamsize == 1:
        gamemode = 0
    elif teamsize == 2:
        gamemode = 1
    elif teamsize == 3:
        gamemode = 3
    for r in ranks.values():
        if len(r) > gamemode:
            if 'tier' in r[gamemode]:
                rank_list.append(r[gamemode]['tier'])
            if 'rank_points' in r[gamemode]:
                mmr_list.append(r[gamemode]['rank_points'])
    replay_id = game.api_game.id
    poss = game.stats['possession']
    g = Game(hash=replay_id, players=[str(p.id) for p in player_objs],
             ranks=rank_list, mmrs=mmr_list, map=game.api_game.map, team0score=game.api_game.teams[0].score,
             team1score=game.api_game.teams[1].score, teamsize=teamsize,
             match_date=game.api_game.time, team0possession=poss.team_possessions[0],
             team1possession=poss.team_possessions[1])  # TODO: add name back
    # name=game.)
    player_games = []
    players = []
    # print('iterating over players')
    for p in player_objs:  # type: GamePlayer
        if isinstance(p.id, list):  # some players have array platform-ids
            p.id = p.id[0]
            print('array id', p.id)
        camera = p.cameraSettings
        loadout = p.loadout
        field_of_view = camera.fieldOfView
        transition_speed = camera.transitionSpeed
        pitch = camera.pitch
        swivel_speed = camera.swivelSpeed
        stiffness = camera.stiffness
        height = camera.height
        distance = camera.distance

        # analysis stuff
        player_hits = [h for h in game.saltie_hits.values() if h.hit.player.online_id == p.id]
        # and not (h.dribble or h.dribble_continuation)])
        hits = len(player_hits)
        analytics = {'dribbles': 0, 'dribble_conts': 0, 'passes': 0, 'shots': 0, 'goals': 0, 'saves': 0}
        for h in player_hits:
            if h.dribble:
                analytics['dribbles'] += 1
            if h.dribble_continuation:
                analytics['dribble_conts'] += 1
            if h.pass_:
                analytics['passes'] += 1
            if h.goal:
                analytics['goals'] += 1
            if h.shot:
                analytics['shots'] += 1
            if h.save:
                analytics['saves'] += 1
        print(analytics)
        pg = PlayerGame(player=p.id, name=p.name, game=replay_id, score=p.matchScore, goals=p.matchGoals,
                        assists=p.matchAssists, saves=p.matchSaves, shots=p.matchShots, field_of_view=field_of_view,
                        transition_speed=transition_speed, pitch=pitch, swivel_speed=swivel_speed, stiffness=stiffness,
                        height=height, distance=distance, car=-1 if loadout is None else loadout.car,
                        is_orange=not p.isOrange,
                        win=game.api_game.teams[int(not p.isOrange)].score > game.api_game.teams[int(p.isOrange)].score,
                        a_dribble_conts=analytics['dribble_conts'], a_dribbles=analytics['dribbles'], a_hits=hits,
                        a_goals=analytics['goals'], a_passes=analytics['passes'], a_shots=analytics['shots'],
                        a_saves=analytics['saves'],
                        a_turnovers=0 if 'turnovers' not in game.stats else game.stats['turnovers'][p.name],
                        a_possession=poss.player_possessions[p.name])
        player_games.append(pg)
        p.id = str(p.id)
        if len(str(p.id)) > 40:
            p.id = p.id[:40]
        p = Player(platformid=p.id, platformname="", avatar="", ranks=[])
        players.append(p)
    return g, player_games, players


def add_objs_to_db(game, player_games, players, s):
    try:
        match = s.query(Game).filter(Game.hash == game.hash).first()
        if match is not None:
            s.delete(match)
            print('deleting {}'.format(match.hash))
        s.add(game)
    except TypeError as e:
        print('Error object: ', e)
        pass
    for pl in players:  # type: Player
        try:
            match = s.query(Player).filter(Player.platformid == str(pl.platformid)).first()
        except TypeError:
            print('platform id', pl.platformid)
            match = None
        if not match:  # we don't need to add duplicate players
            s.add(pl)
    for pg in player_games:
        match = s.query(PlayerGame).filter(PlayerGame.player == str(pg.player)).filter(
            PlayerGame.game == pg.game).first()
        if match is not None:
            s.delete(match)
        s.add(pg)


def render_with_session(template, session, **kwargs):
    response = render_template(template, **kwargs)
    session.close()
    return response


def get_rank_batch(ids, offline_redis=None):
    return_data = {}
    if fake_data or RL_API_KEY is None:
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


fake_data = False


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

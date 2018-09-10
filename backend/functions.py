# Helper functions
import datetime
import json
import os
import random

import redis
import requests
from flask import render_template, current_app

# Replay stuff
from backend.database.objects import Game, PlayerGame, Player
from backend.dynamic_field_manager import create_and_filter_proto_field, get_proto_values
from carball.generated.api import game_pb2

fake_data = False
try:
    from config import RL_API_KEY
except ImportError:
    RL_API_KEY = None
    fake_data = True

json_loc = os.path.join(os.path.dirname(__file__), '..', 'data', 'categorized_items.json')
with open(json_loc, 'r') as f:
    item_dict = json.load(f)



def return_error(msg):
    return render_template('error.html', error=msg)
    # return jsonify({'error': msg})

def get_item_name_by_id(id_):
    return item_dict[id_]


def get_item_dict():
    return item_dict


def convert_pickle_to_db(game: game_pb2, offline_redis=None) -> (Game, list, list):
    """
    Converts pickled games into various database objects.

    :param game: Pickled game to process into Database object
    :return: Game db object, PlayerGame array, Player array
    """
    teamsize = max(len(game.teams[0].player_ids), len(game.teams[1].player_ids))
    player_objs = game.players
    ranks = get_rank_batch([p.id.id for p in player_objs], offline_redis=offline_redis)
    rank_list = []
    mmr_list = []
    gamemode = -1
    if teamsize == 1:
        gamemode = 0
    elif teamsize == 2:
        gamemode = 1
    elif teamsize == 3:
        gamemode = 3
    if gamemode in [0, 1, 2, 3]:
        for r in ranks.values():
            if len(r) > gamemode:
                if 'tier' in r[gamemode]:
                    rank_list.append(r[gamemode]['tier'])
                if 'rank_points' in r[gamemode]:
                    mmr_list.append(r[gamemode]['rank_points'])
    replay_id = game.game_metadata.id
    team0poss = game.teams[0].stats.possession
    team1poss = game.teams[1].stats.possession
    match_date = datetime.datetime.fromtimestamp(game.game_metadata.time)
    g = Game(hash=replay_id, players=[str(p.id.id) for p in player_objs],
             ranks=rank_list, mmrs=mmr_list, map=game.game_metadata.map,
             team0score=game.game_metadata.score.team_0_score,
             team1score=game.game_metadata.score.team_1_score, teamsize=teamsize,
             match_date=match_date, team0possession=team0poss.possession_time,
             team1possession=team1poss.possession_time, name=game.game_metadata.name, frames=game.game_metadata.frames)
    player_games = []
    players = []
    # print('iterating over players')
    for p in player_objs:  # type: GamePlayer
        fields = create_and_filter_proto_field(p, ['name', 'title_id', 'is_orange'],
                                               ['api.metadata.CameraSettings', 'api.metadata.PlayerLoadout',
                                                'api.PlayerId'], PlayerGame)
        values = get_proto_values(p, fields)
        kwargs = {k.field_name: v for k, v in zip(fields, values)}
        camera = p.camera_settings
        loadout = p.loadout
        field_of_view = camera.field_of_view
        transition_speed = camera.transition_speed
        pitch = camera.pitch
        swivel_speed = camera.swivel_speed
        stiffness = camera.stiffness
        height = camera.height
        distance = camera.distance
        blue_score = game.game_metadata.score.team_0_score
        orange_score = game.game_metadata.score.team_1_score
        is_orange = p.is_orange
        if is_orange:
            win = orange_score > blue_score
        else:
            win = blue_score > orange_score
        pid = str(p.id.id)
        pg = PlayerGame(player=pid, name=p.name, game=replay_id, field_of_view=field_of_view,
                        transition_speed=transition_speed, pitch=pitch, swivel_speed=swivel_speed,
                        stiffness=stiffness,
                        height=height, distance=distance, car=-1 if loadout is None else loadout.car,
                        is_orange=p.is_orange,
                        win=win, **kwargs)
        player_games.append(pg)
        if len(str(pid)) > 40:
            pid = pid[:40]
        p = Player(platformid=pid, platformname=p.name, avatar="", ranks=[], groups=[])
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
    """
    Render a template with session objects. Required if there are objs from objects.py being used in the template. Closes session after rendering.

    :param template: template to render
    :param session: session to use (and close afterwards)
    :param kwargs: extra arguments to be passed to render_template
    :return: response object
    """
    response = render_template(template, **kwargs)
    session.close()
    return response


def get_rank_batch(ids, offline_redis=None):
    """
    Gets a batch of ranks based on ids. Returns fake data if there is no API key available.

    :param ids: ids to get from RLAPI
    :param offline_redis: Redis to use if not in the application context
    :return: rank information
    """
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

    print(data.text)
    try:
        data = data.json()
    except:
        return get_empty_data(ids)
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


def get_rank(steam_id):
    """
    Gets a single rank of a given steam id. Just calls get_rank_batch with a single id.

    :param steam_id: steamid to get
    :return: rank, if it exists
    """
    rank = get_rank_batch([steam_id])
    if rank is None:
        return None
    return rank[list(rank.keys())[0]]


def make_fake_data(ids):
    """
    Makes fake rank information.

    :param ids: ids to make information for
    :return: fake rank data
    """
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


def get_empty_data(ids):
    names = {'13': 'standard', '11': 'doubles', '10': 'duel', '12': 'solo'}
    return_data = {}
    for id_ in ids:
        modes = []
        for mode in names.values():
            rank = 0
            div = 0
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

# Helper functions
import json
import os

import redis
import requests
import config
from flask import jsonify, render_template, current_app

# Replay stuff
from objects import Game, PlayerGame, Player
from players import get_rank_batch
from replayanalysis.game.game import Game as ReplayGame
from replayanalysis.game.player import Player as GamePlayer

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


def tier_div_to_string(rank: int, div: int=-1):
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


def get_item_name_by_id(id_):
    return item_dict[id_]


def get_item_dict():
    return item_dict


def get_platform_id(i):
    if len(str(i)) == 17:
        return '1'  # steam
    else:
        return '-1'


def convert_pickle_to_db(game: ReplayGame) -> (Game, list, list):
    """
    Converts pickled games into various database objects.

    :param game: Pickled game to process into Database object
    :return: Game db object, PlayerGame array, Player array
    """
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
    player_games = []
    players = []
    for p in game.players:  # type: GamePlayer
        camera = p.camera_settings
        loadout = p.loadout[int(p.team.is_orange)]
        pg = PlayerGame(player=p.online_id, game=game.replay_id, score=p.score, goals=p.goals, assists=p.assists,
                        saves=p.saves, shots=p.shots, field_of_view=camera['field_of_view'],
                        transition_speed=camera['transition_speed'], pitch=camera['pitch'],
                        swivel_speed=camera['swivel_speed'], stiffness=camera['stiffness'], height=camera['height'],
                        distance=camera['distance'], car=loadout['car'])
        player_games.append(pg)

        p = Player(platformid=p.online_id, platformname=p.name, avatar="", ranks=[])
        players.append(p)
    return g, player_games, players

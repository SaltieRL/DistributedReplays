# Helper functions
import json
import os
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
json_loc = os.path.join(os.path.dirname(__file__), 'data', 'categorized_items.json')
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
    ranks = get_rank_batch([p.online_id for p in game.players], offline_redis=offline_redis)
    # ranks = {p.online_id: get_rank(p.online_id) for p in g.players}
    if len(game.players) > 4:
        mode = 'standard'
    elif len(game.players) > 2:
        mode = 'doubles'
    else:
        mode = 'duel'
    rank_list = []
    mmr_list = []
    for r in ranks:
        if 'tier' in r:
            rank_list.append(r['tier'])
        if 'rank_points' in r:
            mmr_list.append(r['rank_points'])
    g = Game(hash=game.replay_id, players=[str(p.online_id) for p in game.players],
             ranks=rank_list, mmrs=mmr_list, map=game.map, team0score=game.teams[0].score,
             team1score=game.teams[1].score, teamsize=len(game.teams[0].players), match_date=game.datetime,
             name=game.name)
    player_games = []
    players = []
    for p in game.players:  # type: GamePlayer
        if isinstance(p.online_id, list):  # some players have array platform-ids
            p.online_id = p.online_id[0]
            print('array online_id', p.online_id)
        camera = p.camera_settings
        if len(p.loadout) > 1:
            loadout = p.loadout[int(p.team.is_orange)]
        elif len(p.loadout) > 0:
            loadout = p.loadout[0]
        else:
            loadout = None

        field_of_view = camera.get('field_of_view', None)
        transition_speed = camera.get('transition_speed', None)
        pitch = camera.get('pitch', None)
        swivel_speed = camera.get('swivel_speed', None)
        stiffness = camera.get('stiffness', None)
        height = camera.get('height', None)
        distance = camera.get('distance', None)
        pg = PlayerGame(player=p.online_id, name=p.name, game=game.replay_id, score=p.score, goals=p.goals, assists=p.assists,
                        saves=p.saves, shots=p.shots, field_of_view=field_of_view,
                        transition_speed=transition_speed, pitch=pitch,
                        swivel_speed=swivel_speed, stiffness=stiffness, height=height,
                        distance=distance, car=-1 if loadout is None else loadout['car'], is_orange=not p.is_orange,
                        win=game.teams[not p.is_orange].score > game.teams[p.is_orange].score)
        player_games.append(pg)
        p.online_id = str(p.online_id)
        if len(str(p.online_id)) > 40:
            p.online_id = p.online_id[:40]
        p = Player(platformid=p.online_id, platformname="", avatar="", ranks=[])
        players.append(p)
    return g, player_games, players

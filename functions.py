# Helper functions
import json
import os
from flask import jsonify, render_template, current_app

# Replay stuff
from objects import Game, PlayerGame, Player
from players import get_rank_batch
from replayanalysis.analysis.saltie_game.saltie_game import SaltieGame as ReplayGame

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
        player_hits = [h for h in game.saltie_hits.values() if h.hit.player.online_id == '76561198051844298']
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

        pg = PlayerGame(player=p.id, name=p.name, game=replay_id, score=p.matchScore, goals=p.matchGoals,
                        assists=p.matchAssists, saves=p.matchSaves, shots=p.matchShots, field_of_view=field_of_view,
                        transition_speed=transition_speed, pitch=pitch, swivel_speed=swivel_speed, stiffness=stiffness,
                        height=height, distance=distance, car=-1 if loadout is None else loadout.car,
                        is_orange=not p.isOrange,
                        win=game.api_game.teams[int(not p.isOrange)].score > game.api_game.teams[int(p.isOrange)].score,
                        a_dribble_conts=analytics['dribble_conts'], a_dribbles=analytics['dribbles'], a_hits=hits,
                        a_goals=analytics['goals'], a_passes=analytics['passes'], a_shots=analytics['shots'],
                        a_saves=analytics['saves'], a_turnovers=0,
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

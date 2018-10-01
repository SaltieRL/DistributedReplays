import datetime
import math
from typing import List

from carball.generated.api import game_pb2

from backend.database.objects import Game, PlayerGame, Player
from backend.database.utils.dynamic_field_manager import create_and_filter_proto_field, get_proto_values
from backend.utils.psyonix_api_handler import get_rank_batch


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
    replay_id = game.game_metadata.match_guid
    if replay_id == '':
        replay_id = game.game_metadata.id
    team0poss = game.teams[0].stats.possession
    team1poss = game.teams[1].stats.possession
    match_date = datetime.datetime.fromtimestamp(game.game_metadata.time)
    match_name = game.game_metadata.name
    g = Game(hash=replay_id, players=[str(p.id.id) for p in player_objs],
             ranks=rank_list, mmrs=mmr_list, map=game.game_metadata.map,
             team0score=game.game_metadata.score.team_0_score,
             team1score=game.game_metadata.score.team_1_score, teamsize=teamsize,
             match_date=match_date, team0possession=team0poss.possession_time,
             team1possession=team1poss.possession_time, name='' if match_name is None else match_name,
             frames=game.game_metadata.frames, length=game.game_metadata.length,
             playlist=game.game_metadata.playlist,
             game_server_id=game.game_metadata.game_server_id,
             server_name=game.game_metadata.server_name,
             replay_id=game.game_metadata.id
             )

    player_games = []
    players = []
    # print('iterating over players')
    for p in player_objs:  # type: GamePlayer
        fields = create_and_filter_proto_field(p, ['name', 'title_id', 'is_orange'],
                                               ['api.metadata.CameraSettings', 'api.metadata.PlayerLoadout',
                                                'api.PlayerId'], PlayerGame)
        values = get_proto_values(p, fields)
        kwargs = {k.field_name: v for k, v in zip(fields, values)}
        for k in kwargs:
            if kwargs[k] == 'NaN' or math.isnan(kwargs[k]):
                kwargs[k] = 0.0
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

        pid = str(p.id.id)
        rank = None
        mmr = None
        division = None
        if pid in ranks:
            if gamemode in [0, 1, 2, 3]:
                try:
                    rank_obj = ranks[pid][gamemode]
                    rank = rank_obj['tier']
                    division = rank_obj['division']
                    mmr = rank_obj['rank_points']
                except:
                    rank = 0
                    division = 0
                    mmr = 0

        if is_orange:
            win = orange_score > blue_score
        else:
            win = blue_score > orange_score
        pg = PlayerGame(player=pid, name=p.name, game=replay_id, field_of_view=field_of_view,
                        transition_speed=transition_speed, pitch=pitch, swivel_speed=swivel_speed,
                        stiffness=stiffness,
                        height=height, distance=distance, car=-1 if loadout is None else loadout.car,
                        is_orange=p.is_orange, rank=rank, division=division, mmr=mmr,
                        win=win, **kwargs)
        player_games.append(pg)
        if len(str(pid)) > 40:
            pid = pid[:40]
        p = Player(platformid=pid, platformname=p.name, avatar="", ranks=[], groups=[])
        players.append(p)
    return g, player_games, players


def add_objs_to_db(game: Game, player_games: List[PlayerGame], players: List[Player], session,
                   preserve_upload_date=False):
    try:
        matches = session.query(Game).filter(Game.hash == game.hash).all()
        if matches is not None:
            for match in matches:
                if preserve_upload_date:
                    game.upload_date = match.upload_date
                session.delete(match)
                print('deleting {}'.format(match.hash))
        matches = session.query(Game).filter(Game.hash == game.replay_id).all() # catch old replay ids
        if matches is not None:
            for match in matches:
                if preserve_upload_date:
                    game.upload_date = match.upload_date
                session.delete(match)
                print('deleting {}'.format(match.hash))
        session.add(game)
    except TypeError as e:
        print('Error object: ', e)
        pass
    for pl in players:  # type: Player
        try:
            match = session.query(Player).filter(Player.platformid == str(pl.platformid)).first()
        except TypeError:
            print('platform id', pl.platformid)
            match = None
        if not match:  # we don't need to add duplicate players
            session.add(pl)
    for pg in player_games:
        match = session.query(PlayerGame).filter(PlayerGame.player == str(pg.player)).filter(
            PlayerGame.game == pg.game).first()
        if match is not None:
            session.delete(match)
        session.add(pg)

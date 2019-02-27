import datetime
import math
from typing import List

from carball.generated.api import game_pb2

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import Game, PlayerGame, Player, TeamStat
from backend.database.utils.dynamic_field_manager import create_and_filter_proto_field, get_proto_values
from backend.database.wrapper.rank_wrapper import get_rank_obj_by_mapping
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
    for player, rank in ranks.items():
        r = get_rank_obj_by_mapping(rank, playlist=game.game_metadata.playlist)
        rank_list.append(r['tier'])
        mmr_list.append(r['rank_points'])
    replay_id = game.game_metadata.match_guid
    if replay_id == '' or replay_id is None:
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
             game_server_id=0 if game.game_metadata.game_server_id == '' else game.game_metadata.game_server_id,
             server_name=game.game_metadata.server_name,
             replay_id=game.game_metadata.id)

    player_games = []
    players = []
    teamstats = []
    # print('iterating over players')
    for team in game.teams:
        fields = create_and_filter_proto_field(team, ['id', 'name', 'is_orange'], [], TeamStat)
        values = get_proto_values(team, fields)
        kwargs = {k.field_name: v for k, v in zip(fields, values)}
        for k in kwargs:
            if kwargs[k] == 'NaN' or math.isnan(kwargs[k]):
                kwargs[k] = 0.0
        t = TeamStat(game=replay_id, is_orange=team.is_orange, **kwargs)
        teamstats.append(t)

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
            try:
                r = get_rank_obj_by_mapping(ranks[pid], playlist=game.game_metadata.playlist)
                rank = r['tier']
                division = r['division']
                mmr = r['rank_points']
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
    return g, player_games, players, teamstats


def add_objs_to_db(game: Game, player_games: List[PlayerGame], players: List[Player], teamstats: List[TeamStat],
                   session,
                   preserve_upload_date=False, preserve_ranks=True):
    # delete playergames/teamstats first, to prevent orphans
    for pg in player_games:
        match = session.query(PlayerGame).filter(PlayerGame.player == str(pg.player)).filter(
            PlayerGame.game == pg.game).first()
        if match is not None:
            if preserve_ranks:
                pg.rank = match.rank
                pg.division = match.division
                pg.mmr = match.mmr
            session.delete(match)

        matches = session.query(PlayerGame).filter(PlayerGame.player == str(pg.player)).filter(
            PlayerGame.game == game.replay_id).all()  # catch old replay ids
        if matches is not None:
            for match in matches:
                if preserve_ranks:
                    pg.rank = match.rank
                    pg.division = match.division
                    pg.mmr = match.mmr
                session.delete(match)

    matches = session.query(TeamStat).filter(TeamStat.game == game.hash).all()
    if matches is not None:
        for match in matches:
            session.delete(match)

    try:
        matches = session.query(Game).filter(Game.hash == game.hash).all()
        if matches is not None:
            for match in matches:
                if preserve_upload_date:
                    game.upload_date = match.upload_date
                if preserve_ranks:
                    game.ranks = match.ranks
                    game.mmrs = match.mmrs
                session.delete(match)
                print('deleting {}'.format(match.hash))
        matches = session.query(Game).filter(Game.hash == game.replay_id).all()  # catch old replay ids
        if matches is not None:
            for match in matches:
                if preserve_upload_date:
                    game.upload_date = match.upload_date
                if preserve_ranks:
                    game.ranks = match.ranks
                    game.mmrs = match.mmrs
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
        session.add(pg)
    for team in teamstats:
        session.add(team)


@with_session
def add_objects(protobuf_game, session=None):
    game, player_games, players, teamstats = convert_pickle_to_db(protobuf_game)
    add_objs_to_db(game, player_games, players, teamstats, session, preserve_upload_date=True)
    session.commit()

import re

from flask import current_app, jsonify, request

from backend.blueprints.steam import get_vanity_to_steam_id_or_random_response, steam_id_to_profile
from backend.database.wrapper.stats.player_stat_wrapper import TimeUnit
from .errors.errors import CalculatedError, MissingQueryParams
from .service_layers.player.play_style import PlayStyleResponse
from .service_layers.player.play_style_progression import PlayStyleProgression
from .service_layers.player.player import Player
from .service_layers.player.player_profile_stats import PlayerProfileStats
from .service_layers.player.player_ranks import PlayerRanks
from .service_layers.replay.match_history import MatchHistory
from .spa_api import bp
from .utils.better_jsonify import better_jsonify
from .utils.query_params_handler import QueryParam, get_query_params, convert_to_enum, \
    convert_to_datetime


@bp.route('player/<id_or_name>')
def api_get_player(id_or_name):
    if len(id_or_name) != 17 or re.match(re.compile('\d{17}'), id_or_name) is None:
        # Treat as name
        response = get_vanity_to_steam_id_or_random_response(id_or_name, current_app)
        if response is None:
            raise CalculatedError(404, "User not found")
        steam_id = response['response']['steamid']
        return jsonify(steam_id)
    else:
        # Treat as id
        result = steam_id_to_profile(id_or_name)
        if result is None:
            raise CalculatedError(404, "User not found")
        return jsonify(id_or_name)


@bp.route('player/<id_>/profile')
def api_get_player_profile(id_):
    player = Player.create_from_id(id_)
    return better_jsonify(player)


@bp.route('player/<id_>/profile_stats')
def api_get_player_profile_stats(id_):
    player_stats = PlayerProfileStats.create_from_id(id_)
    return better_jsonify(player_stats)


@bp.route('player/<id_>/ranks')
def api_get_player_ranks(id_):
    player_ranks = PlayerRanks.create_from_id(id_)
    return better_jsonify(player_ranks)


@bp.route('player/<id_>/play_style')
def api_get_player_play_style(id_):
    if 'rank' in request.args:
        rank = int(request.args['rank'])
    else:
        rank = None
    if 'playlist' in request.args:
        playlist = request.args['playlist']
    else:
        playlist = 13  # standard
    if 'win' in request.args:
        win = bool(int(request.args['win']))
    else:
        win = None
    play_style_response = PlayStyleResponse.create_from_id(id_, raw='raw' in request.args, rank=rank, playlist=playlist,
                                                           win=win)
    return better_jsonify(play_style_response)


@bp.route('player/<id_>/play_style/all')
def api_get_player_play_style_all(id_):
    accepted_query_params = [
        QueryParam(name='rank', optional=True, type_=int),
        QueryParam(name='replay_ids', optional=True)
    ]
    query_params = get_query_params(accepted_query_params, request)

    play_style_response = PlayStyleResponse.create_all_stats_from_id(id_, **query_params)
    return better_jsonify(play_style_response)


@bp.route('player/<id_>/play_style/progression')
def api_get_player_play_style_progress(id_):
    accepted_query_params = [
        QueryParam(name='time_unit', optional=True, type_=convert_to_enum(TimeUnit)),
        QueryParam(name='start_date', optional=True, type_=convert_to_datetime),
        QueryParam(name='end_date', optional=True, type_=convert_to_datetime),
    ]
    query_params = get_query_params(accepted_query_params, request)

    play_style_progression = PlayStyleProgression.create_progression(id_, **query_params)
    return better_jsonify(play_style_progression)


@bp.route('player/<id_>/match_history')
def api_get_player_match_history(id_):
    page = request.args.get('page')
    limit = request.args.get('limit')

    if page is None or limit is None:
        missing_params = []
        if page is None:
            missing_params.append('page')
        if limit is None:
            missing_params.append('limit')
        raise MissingQueryParams(missing_params)
    match_history = MatchHistory.create_from_id(id_, int(page), int(limit))
    return better_jsonify(match_history)
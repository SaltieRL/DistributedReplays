import json
import logging
import traceback

import requests
from flask import jsonify, request, redirect, url_for, Blueprint, current_app

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.wrapper.player_wrapper import get_random_player, create_default_player

try:
    from config import STEAM_API_KEY
except:
    STEAM_API_KEY = 'INVALID_KEY'

logger = logging.getLogger(__name__)

bp = Blueprint('steam', __name__, url_prefix='/steam')


@bp.route('/resolve', methods=['POST'])
def resolve_steam():
    if 'name' not in request.form:
        return jsonify({})
    r = get_vanity_to_steam_id_or_random_response(request.form['name'])
    if r is None:
        steamid = request.form['name']
    else:
        steamid = r['response']['steamid']
    return redirect(url_for('players.view_player', id_=steamid))


def get_steam_profile_or_random_response(steam_id):
    try:
        return steam_id_to_profile(steam_id)
    except BaseException as e:
        logger.warning(e)
        traceback.print_exc()
        player = create_default_player()
        print(f"Returning default player: {player}")
        return {
            'response': {
                'players': [{
                    'steamid': player.platformid,
                    'personaname': player.platformname,
                    'avatarfull': player.avatar,
                    'platformname': player.platformname,
                    'profileurl': f"https://steamcommunity.com/id/{player.platformid}/",
                    'avatar': player.avatar
                }]
            }
        }


def steam_id_to_profile(steam_id):
    key = 'steam_id_' + steam_id
    try:
        redis_instance = current_app.config['r']
    except:
        redis_instance = None
    if redis_instance is not None:
        match = redis_instance.get(key)
        if match is not None:
            return json.loads(match)
    profile_url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={steamKey}&steamids={steamID}'.format(
        steamKey=STEAM_API_KEY, steamID=steam_id)
    resp = requests.get(profile_url)
    resp.raise_for_status()
    if len(resp.json()['response']['players']) == 0:
        return None
    else:
        if redis_instance is not None:
            redis_instance.set(key, json.dumps(resp.json()), ex=60 * 60 * 24)
        return resp.json()


@with_session
def get_vanity_to_steam_id_or_random_response(vanity, session=None):
    try:
        return vanity_to_steam_id(vanity)
    except BaseException as e:
        logger.warning(e)
        traceback.print_exc()
        player = get_random_player(session)
        return {
            'response': {
                'steamid': player.platformid
            }
        }


def vanity_to_steam_id(vanity):
    key = 'vanity_' + vanity
    try:
        redis_instance = current_app.config['r']
    except:
        redis_instance = None
    if redis_instance is not None:
        match = redis_instance.get(key)
        if match is not None:
            return json.loads(match)
    steam_url = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key={steamKey}&vanityurl={steamID}'.format(
        steamKey=STEAM_API_KEY, steamID=vanity)
    resp = requests.get(steam_url)
    resp.raise_for_status()
    if resp.json()['response']['success'] == 42:
        return None
    else:
        if redis_instance is not None:
            redis_instance.set(key, json.dumps(resp.json()), ex=60 * 60 * 24)
        return resp.json()

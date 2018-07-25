import requests
from flask import jsonify, request, redirect, url_for, Blueprint
from config import STEAM_API_KEY

bp = Blueprint('steam', __name__, url_prefix='/steam')

@bp.route('/resolve', methods=['POST'])
def resolve_steam():
    if 'name' not in request.form:
        return jsonify({})
    r = vanity_to_steam_id(request.form['name'])
    steamid = r['response']['steamid']
    return redirect(url_for('replays.view_player', id_=steamid))


def steam_id_to_profile(steamID):
    profile_url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={steamKey}&steamids={steamID}'.format(
        steamKey=STEAM_API_KEY, steamID=steamID)
    r = requests.get(profile_url)
    r.raise_for_status()
    return r.json()


def vanity_to_steam_id(vanity):
    steam_url = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key={}&vanityurl={}'.format(
        STEAM_API_KEY, vanity)
    r = requests.get(steam_url)
    r.raise_for_status()
    return r.json()

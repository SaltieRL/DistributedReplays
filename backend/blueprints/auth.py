import re
from urllib.parse import urlencode

import requests
from flask import Blueprint, current_app, redirect, request, url_for, jsonify, session

from backend.database.objects import Player
from backend.blueprints.steam import get_steam_profile_or_random_response

bp = Blueprint('auth', __name__, url_prefix='/auth')
STEAM_OPEN_ID_URL = 'https://steamcommunity.com/openid/login'


def discover(url):
    return 'https://steamcommunity.com/openid/login'


def validate_openid(args):
    prefix = 'openid.'

    def k(key):
        return prefix + key

    if k('user_setup_url') in args:
        return False

    if args[k('mode')] != 'id_res':
        return False

    claimed_id = args[k('claimed_id')]
    params = {
        k('assoc_handle'): args[k('assoc_handle')],
        k('signed'): args[k('signed')],
        k('sig'): args[k('sig')]
    }

    if k('ns') in args:
        # openid 2 server
        params[k('ns')] = 'http://specs.openid.net/auth/2.0'
    # elif k('openid_claimed_id') in args and args[k('openid_claimed_id')] == args[k('openid_identity')]:
    #     args[k('return_')]
    if not args[k('return_to')].startswith(current_app.config['BASE_URL']):
        return False

    server = discover(claimed_id)
    for val in args[k('signed')].split(','):
        v = args[k(val)]
        params[k(val)] = v

    params[k('mode')] = 'check_authentication'
    response = requests.post(server, data=params)
    return re.search('is_valid\s*:\s*true', response.text) is not None


@bp.route('/steam')
def steam_auth():
    # if g.user is not None:
    #     print(g.user)
    #     return redirect('/')
    params = {
        'openid.ns': "http://specs.openid.net/auth/2.0",
        'openid.identity': "http://specs.openid.net/auth/2.0/identifier_select",
        'openid.claimed_id': "http://specs.openid.net/auth/2.0/identifier_select",
        'openid.mode': 'checkid_setup',
        'openid.return_to': current_app.config['BASE_URL'] + '/auth/steam/process',
        'openid.realm': current_app.config['BASE_URL'] + '/'
    }

    query_string = urlencode(params)
    auth_url = STEAM_OPEN_ID_URL + "?" + query_string
    return redirect(auth_url)


@bp.route('/steam/process')
def steam_process():
    if validate_openid(request.args):
        user_id = request.args['openid.claimed_id'].split('/')[-1]
        profile = get_steam_profile_or_random_response(user_id, current_app)['response']['players'][0]
        s = current_app.config['db']()
        match = s.query(Player).filter(Player.platformid == user_id).first()
        if match:
            match.platformname = profile['personaname']
            match.avatar = profile['avatarfull']
        else:
            u = Player(platformid=user_id, platformname=profile['personaname'], avatar=profile['avatarfull'], groups=[])
            s.add(u)
        s.commit()
        s.close()
        session['openid'] = user_id
        return redirect(url_for('home'))
    return jsonify({'error': 'invalid openid credentials'})


@bp.route('/logout')
def logout():
    if 'openid' in session:
        del session['openid']
        return redirect('/')
    else:
        return redirect('/')

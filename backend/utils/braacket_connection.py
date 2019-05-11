import re

import requests
from bs4 import BeautifulSoup


class Braacket:

    def __init__(self):
        self.league = "rlbot"
        self.player_cache = {}
        self.update_player_cache()

    def update_player_cache(self):
        # pretty straight forward. the leagues are their name
        # in the url, however as you'll see later on, players
        # have a unique id assigned to them that we have to 
        # extract with BeautifulSoup

        # player cache is laid out as such:
        # {
        #   'tag1': 'uuid',
        #   'tag2': 'uuid',
        #   'tag3': 'uuid',
        #   ...
        # }
        r = requests.get(
            'https://braacket.com/league/'
            f'{self.league}/player?rows=200', verify=False)
        # dear braacket, please never disable this upperbound
        soup = BeautifulSoup(r.text, 'html.parser')
        # <table class='table table-hover'> -v
        # <tbody> -> <tr> -> <td> -> <a> {player}
        players = soup.select("table.table.table-hover a")
        self.player_cache = {}
        # /league/{league}/player/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
        url_extract = re.compile(r'.*\/([^\/]*)')
        for player in players:
            # BeautifulSoup returns exactly one empty
            # player, not sure why...
            if not player.string:
                continue
            # match // extract, potential for a mtg fuse spell
            uuid = url_extract.match(player['href']).group(1)
            self.player_cache[player.string] = uuid

    def get_ranking(self, uuid):
        r = requests.get(
            'https://braacket.com/league/'
            f'{self.league}/player/{uuid}', verify=False)
        soup = BeautifulSoup(r.text, 'html.parser')
        player_stats = {}  # gonna fill this w/ a lot of stuff
        # :: TAG ::
        # tag can be found in:
        # <tr> -> <td> -> <h4 class='ellipsis'>
        if len(soup.select("tr td h4.ellipsis")) == 0:
            return None
        tag = soup.select("tr td h4.ellipsis")[0].get_text().strip()
        player_stats['tag'] = tag
        # :: RANKING ::
        try:
            ranking_info = soup.select(
                'section div.row div.col-lg-6 '
                'div.panel.panel-default.my-box-shadow '
                'div.panel-body '
                'div.my-dashboard-values-main')[0].stripped_strings  # generator
            ranking_info = [text for text in ranking_info]  # array !
        except IndexError:  # rank -1 means un ranked
            return None
        exclusion_check = soup.select(
            'section div.row div.col-lg-6 '
            'div.panel.panel-default.my-box-shadow '
            'div.panel-body '
            'div.my-dashboard-values-sub div i.fa-exclamation-triangle')  # inactive
        if len(exclusion_check) > 0:
            return None
        sub_panels = soup.select(
            'section div.row div.col-lg-6 '
            'div.panel.panel-default.my-box-shadow '
            'div.panel-body '
            'div.my-dashboard-values-sub')
        sub_panels_stripped = {}
        for panel in sub_panels:
            panel_array = [text for text in panel.stripped_strings]
            # take the 1st item, lower its case, and make it the key.
            # take the rest of the items in the array, and join them with
            # a space and make it the value.
            sub_panels_stripped[panel_array[0].lower()] = ' '.join(panel_array[1:])
        if 'points' in sub_panels_stripped:  # one off, maybe do these in bulk later
            mmr = sub_panels_stripped['points']
        return ranking_info, mmr

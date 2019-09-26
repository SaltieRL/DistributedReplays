import json

import requests

from backend.database.startup import lazy_get_redis

try:
    import config

    API_KEY = config.RLGARAGE_API_KEY

except:
    API_KEY = ""


class RLGarageAPI:
    BASE_URL = "https://rocket-league.com/api/v2/items/"
    # RLG URL scheme
    paint_map = {
        1: "Crimson",
        2: "Lime",
        3: "Black",
        4: "Cobalt",
        5: "SkyBlue",
        6: "BurntSienna",
        7: "ForestGreen",
        8: "Purple",
        9: "Pink",
        10: "Orange",
        11: "Grey",
        12: "TitaniumWhite",
        13: "Saffron"
    }
    # Human readable
    paint_name_map = {
        1: "Crimson",
        2: "Lime",
        3: "Black",
        4: "Cobalt",
        5: "Sky Blue",
        6: "Burnt Sienna",
        7: "Forest Green",
        8: "Purple",
        9: "Pink",
        10: "Orange",
        11: "Grey",
        12: "Titanium White",
        13: "Saffron"
    }

    def __init__(self):
        items = self.get_cached_items()
        self.items = {}
        for item in items.values():
            try:
                self.items[item['ingameid']] = item
            except:
                print("Error", item)

    def _get(self, url):
        headers = {
            'cache-control': "no-cache",
            'Authkey': API_KEY
        }
        return requests.get(self.BASE_URL + url, headers=headers).json()

    def get_items(self):
        """
        Gets all items
        :return:
        """
        return self._get("getAll.php")

    def get_editions(self):
        """
        Special edition ids
        :return:
        """
        return self._get("getEditions.php")

    def get_fixtures(self):
        """
        Get things like paint and rarity colors
        :return:
        """
        return self._get("getFixtures.php")

    def get_cached_items(self):
        r = lazy_get_redis()
        if r is not None:
            if r.get("rlgarage_items") is not None:
                return json.loads(r.get("rlgarage_items"))
        items = self.get_items()

        if r is not None:
            r.set("rlgarage_items", json.dumps(items), ex=60 * 60 * 24)
        return items

    def get_item_info(self, id_, paint_id=0):
        item = self.items[id_]
        if paint_id > 0 and item['hascoloredicons'] == 1:
            pic = item['name'].replace(' ', '').replace('\'', '').lower()
            paint_name = self.paint_map[paint_id]
            item['image'] = f"https://rocket-league.com/content/media/items/avatar/220px/" \
                            f"{pic}/{pic}-{paint_name}.png"
        else:
            item['image'] = f"https://rocket-league.com/content/media/items/avatar/220px/{item['image']}"
        return item

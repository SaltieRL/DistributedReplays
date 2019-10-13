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
        self.item_map, self.category_map = self.get_cached_items()
        self.item_list = list(self.item_map.values())

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
        data = self._get("getAll.php")
        items = {}
        category_map = {}
        for item in data.values():
            try:
                items[item['ingameid']] = self.parse_item(item)
            except Exception as e:
                print("Error", e)
            category = item['category']
            if category in category_map:
                category_map[category].append(item)
            else:
                category_map[category] = [item]
        return items, category_map

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
            if r.get("rlgarage_items") is not None and r.get("rlgarage_category_map") is not None:
                return json.loads(r.get("rlgarage_items")), json.loads(r.get("rlgarage_category_map"))
        items, category_map = self.get_items()

        if r is not None:
            r.set("rlgarage_items", json.dumps(items), ex=60 * 60 * 24)
            r.set("rlgarage_category_map", json.dumps(category_map), ex=60 * 60 * 24)
        return items, category_map

    def get_item_info(self, id_, paint_id=0):
        item = self.item_map[id_]
        return self.parse_item(item, paint_id)

    def parse_item(self, item, paint_id=0):
        if paint_id > 0 and item['hascoloredicons'] == 1:
            pic = item['name'].replace(' ', '').replace('\'', '').lower()
            paint_name = self.paint_map[paint_id]
            item['image'] = f"https://rocket-league.com/content/media/items/avatar/220px/" \
                            f"{pic}/{pic}-{paint_name}.png"
        else:
            item['image'] = f"https://rocket-league.com/content/media/items/avatar/220px/{item['image']}"
        return item

    def get_item(self, id_):
        return self.item_map[str(id_)]

    def get_item_list(self, page, limit):
        if limit > 500:
            limit = 500
        return {
            'items': self.get_item_response(self.item_list[page * limit: (page + 1) * limit]),
            'count': len(self.item_list)
        }

    def get_item_list_by_category(self, category, page, limit):
        category = str(category)
        if limit > 500:
            limit = 500
        return {
            'items': self.get_item_response(self.category_map[category][page * limit: (page + 1) * limit]),
            'count': len(self.category_map[category])
        }

    def get_item_response(self, items):
        return [
            {
                'image': item['image'],
                'name': item['name'],
                'ingameid': item['ingameid'],
                'rarity': item['rarity']
            } for item in items
        ]

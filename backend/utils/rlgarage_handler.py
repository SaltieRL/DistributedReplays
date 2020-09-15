import json

import requests

from backend.blueprints.spa_api.errors.errors import CalculatedError
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
    item_map = None
    category_map = None

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
                items[item['ingameid']] = item
            except Exception as e:
                print("Error", e)
            try:
                category = item['category']
                if category in category_map:
                    category_map[category].append(item)
                else:
                    category_map[category] = [item]
            except Exception as e:
                print("Error", e)
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

    def cache_items(self):
        r = lazy_get_redis()
        if r is None:
            raise CalculatedError()
        items, category_map = self.get_items()
        for item in items:
            r.set(f"rlgarage_{item}", json.dumps(items[item]))
        r.set("rlgarage_category_map", json.dumps(category_map))
        r.set("rlgarage_items", json.dumps(items))

    def get_item(self, id_, paint_id=0):
        if self.item_map is not None and id_ in self.item_map:
            return self.item_map[id_]
        r = lazy_get_redis()
        item = r.get(f'rlgarage_{id_}')
        if item is None:
            return None
        item = json.loads(item)
        if paint_id > 0 and item['hascoloredicons'] == 1:
            pic = item['name'].replace(' ', '').replace('\'', '').lower()
            paint_name = self.paint_map[paint_id]
            item['image'] = f"https://rocket-league.com/content/media/items/avatar/220px/" \
                            f"{pic}/{pic}-{paint_name}.png"
        else:
            item['image'] = f"https://rocket-league.com/content/media/items/avatar/220px/{item['image']}"
        return item

    def get_item_list(self, page, limit, override=False):
        if self.item_map is None:
            r = lazy_get_redis()
            self.item_map, self.category_map = json.loads(r.get("rlgarage_items")), \
                                               json.loads(r.get("rlgarage_category_map"))
        if not override and limit > 500:
            limit = 500
        item_list = list(self.item_map.values())
        return {
            'items': self.get_item_response(item_list[page * limit: (page + 1) * limit]),
            'count': len(item_list)
        }

    def get_item_list_by_category(self, category, page, limit, order=None):
        category = str(category)
        if limit > 500:
            limit = 500
        if order is not None:
            return {
                'items': self.get_item_response(
                    [self.get_item(str(i)) for i in order[page * limit: (page + 1) * limit] if
                     str(i) in self.item_map]),
                'count': len(self.category_map[category])
            }
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


if __name__ == '__main__':
    api = RLGarageAPI()

    items, category_map = api.get_items()
    print(items, category_map)

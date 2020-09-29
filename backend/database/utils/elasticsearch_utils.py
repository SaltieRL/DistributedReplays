import datetime
import json
from enum import Enum

from elasticsearch import Elasticsearch
from sqlalchemy.ext.declarative import DeclarativeMeta

from backend.database.startup import get_es


class Index:
    @staticmethod
    def get_id(doc):
        raise NotImplemented

    @staticmethod
    def get_name():
        raise NotImplemented


class GamesIndex(Index):
    _name = "games"

    @staticmethod
    def get_id(doc):
        return f"games_{doc['hash']}"

    @staticmethod
    def get_name():
        return GamesIndex._name


def add_game_to_elasticsearch(game):
    es: Elasticsearch = get_es()
    dict_obj = convert_to_dict(game)
    res = es.index(index=GamesIndex.get_name(), body=dict_obj, id=GamesIndex.get_id(dict_obj))
    print("Elasticsearch insert: " + res['result'])


def convert_to_dict(obj):
    if isinstance(obj.__class__, DeclarativeMeta):
        # an SQLAlchemy class
        fields = {}
        for field in [x for x in dir(obj) if not x.startswith('_') and x != 'metadata']:
            data = obj.__getattribute__(field)
            if isinstance(data, (datetime.date, datetime.datetime)):
                fields[field] = data.isoformat()
            if isinstance(data, Enum):
                fields[field] = data.value
            try:
                json.dumps(data)  # this will fail on non-encodable values, like other classes
                fields[field] = data
            except TypeError:
                pass
        # a json-encodable dict
        return fields

    return obj

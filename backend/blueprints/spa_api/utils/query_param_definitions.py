import datetime
from enum import Enum
from typing import TypeVar, Type, Callable

from backend.blueprints.spa_api.utils.query_params_handler import QueryParam
from backend.database.objects import GameVisibilitySetting
from backend.database.wrapper.stats.player_stat_wrapper import TimeUnit
from backend.utils.time_related import hour_rounder, convert_to_datetime

T = TypeVar('T', bound=Enum)


def convert_to_enum(enum: Type[T]) -> Callable[[str], T]:
    # TODO: Type this to reject non-enums while stil typing the return of the function
    def convert_string_to_enum(string: str) -> T:
        return enum[string.upper()]
    return convert_string_to_enum


visibility_params = [
    QueryParam(name='release_date', optional=True,
               type_=float,
               secondary_type=lambda param: hour_rounder(datetime.datetime.fromtimestamp(param)),
               required_siblings=['visibility', 'player_id'],
               tip='Remember that this date needs to be a timestamp in UTC time in seconds'),
    QueryParam(name='visibility', optional=True,
               secondary_type=convert_to_enum(GameVisibilitySetting),
               required_siblings=['player_id'])
]

tag_params = [
    QueryParam(name="tags", optional=True,
               type_=str, is_list=True,
               required_siblings=['player_id'])
]


# Query params for uploading a file
upload_file_query_params = [
    QueryParam(name='player_id', optional=True, type_=str)
] + visibility_params + tag_params


replay_search_query_params = [
    QueryParam(name='page', type_=int),
    QueryParam(name='limit', type_=int),
    QueryParam(name='player_ids', optional=True, is_list=True),
    QueryParam(name='playlists', optional=True, is_list=True, type_=int),
    QueryParam(name='rank', optional=True, type_=int),
    QueryParam(name='team_size', optional=True, type_=int),
    QueryParam(name='date_before', optional=True, type_=convert_to_datetime),
    QueryParam(name='date_after', optional=True, type_=convert_to_datetime),
    QueryParam(name='min_length', optional=True, type_=float),
    QueryParam(name='max_length', optional=True, type_=float),
    QueryParam(name='map', optional=True),
]


progression_query_params = [
    QueryParam(name='time_unit', optional=True, type_=convert_to_enum(TimeUnit)),
    QueryParam(name='start_date', optional=True, type_=convert_to_datetime),
    QueryParam(name='end_date', optional=True, type_=convert_to_datetime),
    QueryParam(name='playlist', optional=True, type_=int),
]


playstyle_query_params = [
    QueryParam(name='rank', optional=True, type_=int),
    QueryParam(name='replay_ids', optional=True),
    QueryParam(name='playlist', optional=True, type_=int),
]

import datetime
from enum import Enum
from typing import List, Dict, Any, Callable, Type, TypeVar

from flask import Request

from backend.blueprints.spa_api.errors.errors import MissingQueryParams


class QueryParam:
    def __init__(self, name: str, is_list: bool = False, optional: bool = False, type_: Callable = None):
        self.name = name
        self.is_list = is_list
        self.optional = optional
        self.type = type_

    def __str__(self):
        return f"QueryParam: {self.name}, is_list: {self.is_list}, optional: {self.optional}, type: {self.type}"


def get_query_params(query_params: List[QueryParam], request: Request) -> Dict[str, Any]:
    # Check that all required query params exist
    missing_query_params = [
        query_param.name
        for query_param in query_params
        if (not query_param.optional) and (query_param.name not in request.args)
    ]
    if len(missing_query_params) > 0:
        raise MissingQueryParams(missing_query_params)

    found_query_params = {}

    for query_param in query_params:
        if query_param.name in request.args:
            if query_param.is_list:
                value = request.args.getlist(query_param.name, type=query_param.type)
            else:
                value = request.args.get(query_param.name, type=query_param.type)
            found_query_params[query_param.name] = value

    return found_query_params


def convert_to_datetime(timestamp: str):
    return datetime.datetime.fromtimestamp(int(timestamp))


T = TypeVar('T', bound=Enum)


def convert_to_enum(enum: Type[T]) -> Callable[[str], T]:
    # TODO: Type this to reject non-enums while stil typing the return of the function
    def convert_string_to_enum(string: str) -> T:
        return enum[string.upper()]
    return convert_string_to_enum


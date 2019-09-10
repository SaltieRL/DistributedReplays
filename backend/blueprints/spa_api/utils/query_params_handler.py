from typing import List, Dict, Any, Callable, Optional
from urllib.parse import urlencode

from flask import Request

from backend.blueprints.spa_api.errors.errors import MissingQueryParams, InvalidQueryParamFormat, MismatchedQueryParams, \
    CalculatedError


class QueryParam:
    def __init__(self, name: str, is_list: bool = False, optional: bool = False,
                 type_: Callable = None, required_siblings: List=None, tip: str=None, secondary_type=None):
        self.name = name
        self.is_list = is_list
        self.optional = optional
        self.type = type_
        self.required_siblings = required_siblings
        self.tip = tip
        self.secondary_type = secondary_type

    def __str__(self):
        return (f"QueryParam: {self.name}, is_list: {self.is_list},"
                f" optional: {self.optional}, type: {self.type}"
                f"required params: {self.required_siblings}"
                f"tip: {self.tip}")

    def to_JSON(self):
        result = {
            'name': self.name,
            'is_list': self.is_list,
            'optional': self.optional,
            'type': 'string' if self.type is None else str(self.type)
        }

        if self.required_siblings is not None:
            result['required_siblings'] = self.required_siblings
        if self.tip is not None:
            result['tip'] = self.tip
        if self.secondary_type is not None:
            result['secondary_type'] = str(self.secondary_type)
        return result


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
            if value is None and request.args.get(query_param.name) is not None:
                raise InvalidQueryParamFormat(query_param, request.args.get(query_param.name))

            # catch errors from secondary parsing upfront
            try:
                if query_param.secondary_type is not None and query_param.secondary_type(value) is None:
                    raise InvalidQueryParamFormat(query_param, value)
            except:
                raise InvalidQueryParamFormat(query_param, value)

            found_query_params[query_param.name] = value

    return found_query_params


def parse_query_params(query_params: List[QueryParam], args: Dict[str, str], add_initial=False, add_secondary=False):
    found_query_params = {}
    for query_param in query_params:
        if query_param.name in args:
            initial_value = args[query_param.name]
            value = initial_value
            if add_initial:
                value = query_param.type(initial_value)
            if add_secondary and query_param.secondary_type is not None:
                value = query_param.secondary_type(initial_value)
            found_query_params[query_param.name] = value
    return found_query_params


def create_validation_for_query_params(query_params: List[QueryParam], provided_params: List[str]) -> Callable:
    """
    Creates a function that will validate that the query has all required siblings
    and that required siblings have valid values.
    If a query is a list it requires that all list siblings have the same list length.
    :return: A function that is used to validate queries.
    """
    if provided_params is None:
        provided_params = []
    check_dict: Dict[str, List[str]] = dict()
    list_check: Dict[str, List[QueryParam]] = dict()
    for query in query_params:
        if query.required_siblings is not None and query.name not in provided_params:
            check_dict[query.name] = query.required_siblings

    for query in query_params:
        if query.required_siblings is not None and query.name not in provided_params and query.is_list:
            for sibling in query.required_siblings:
                if sibling in list_check:
                    continue
                for sibling_query in query_params:
                    if sibling_query == query:
                        continue
                    if sibling_query.name == sibling and sibling_query.is_list:
                        if query.name in list_check:
                            list_check[query.name].append(sibling_query)
                        else:
                            list_check[query.name] = [sibling_query]

    def validate(created_query_params) -> Optional[CalculatedError]:
        for query, siblings in check_dict.items():
            if query in created_query_params:
                for value in siblings:
                    if value not in created_query_params and value not in provided_params:
                        return MissingQueryParams(siblings)
        for query, siblings in list_check.items():
            if query in created_query_params:
                for sibling_query in siblings:
                    if len(created_query_params[query]) != len(created_query_params[sibling_query.name]):
                        return MismatchedQueryParams(query, sibling_query.name,
                                                     len(created_query_params[query]),
                                                     len(created_query_params[sibling_query.name]))
    return validate


def create_query_string(query_params):
    return urlencode(query_params)


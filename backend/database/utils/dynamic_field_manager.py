import math
from typing import List
from google.protobuf.descriptor import FieldDescriptor
from google.protobuf import message

from backend.database.objects import DBObjectBase, PlayerGame
from carball.generated.api import player_pb2


class DynamicFieldResult:
    def __init__(self, field_name: str):
        self.field_name = field_name


class ProtoFieldResult(DynamicFieldResult):
    def __init__(self, nested_parents: List[str], field_name: str, field_descriptor, nested_names: List[str] = None):
        super().__init__(field_name)
        self.field_descriptor = field_descriptor
        self.nested_parents = nested_parents
        self.nested_names = nested_names


def get_proto_fields_as_flatten_list(proto_message: message,
                                     nested_parents: List[str] = None,
                                     nested_fields: List[str] = None) -> List[ProtoFieldResult]:
    """
    Gets the result of a flatten version of all fields in the protobuf object.
    :param proto_message:  A class representing what we want to get the fields from.  It is not an instance.
    :param nested_parents: A list that contains all parents of the current object
    :param nested_fields: A list that contains all fields to get to the current object.
    :return:  A flatten list
    """
    result_list = []
    message_name = proto_message.DESCRIPTOR.full_name
    if nested_parents is None:
        nested_parents = [message_name]
    else:
        nested_parents = nested_parents + [message_name]

    for field in proto_message.DESCRIPTOR.fields:
        if field.type == FieldDescriptor.TYPE_MESSAGE:
            if nested_fields is None:
                new_list = [field.name]
            else:
                new_list = nested_fields + [field.name]
            results = get_proto_fields_as_flatten_list(field.message_type._concrete_class,
                                                       list(nested_parents), list(new_list))
            result_list += results
        else:
            result_list.append(ProtoFieldResult(nested_parents, field.name, field, nested_fields))
    return result_list


def filter_proto_fields(proto_field_list: List[ProtoFieldResult], blacklist_field_names: List[str],
                        blacklist_message_types: List[str]):
    result_list = []
    for item in proto_field_list:
        allowed = True
        if blacklist_field_names is not None:
            for name in blacklist_field_names:
                if name == item.field_name:
                    allowed = False
        if blacklist_message_types is not None:
            for message in blacklist_message_types:
                if message in item.nested_parents:
                    allowed = False
        if allowed:
            result_list.append(item)
    return result_list


def get_db_proto_union(proto_field_list: List[ProtoFieldResult], db_object: DBObjectBase) -> List[ProtoFieldResult]:
    result_list = []
    for item in proto_field_list:
        if not hasattr(db_object, item.field_name):
            continue
        result_list.append(item)
    return result_list


def get_whitelist_proto_union(proto_field_list: List[ProtoFieldResult],
                              whitelist_field_name: [str],
                              whitelist_message_type: [str]) -> List[ProtoFieldResult]:
    result_list = []
    allowed = False
    for item in proto_field_list:
        if whitelist_field_name is not None and item.field_name in whitelist_field_name:
            allowed = True
        if whitelist_message_type is not None:
            for field_type in whitelist_message_type:
                if field_type in item.nested_parents:
                    allowed = True
        if allowed:
            result_list.append(item)
    return result_list


def create_and_filter_proto_field(proto_message: message,
                                  blacklist_field_names: List[str]=None,
                                  blacklist_message_types: List[str]=None,
                                  db_object: DBObjectBase=None,
                                  whitelist_field_names: List[str]=None,
                                  whitelist_message_types: List[str]=None) -> List[ProtoFieldResult]:
    """
    Creates a flatten list of the union of protobuf and db objects.

    First this limits to just the whitelist if it exists
    Then filters out the blacklist
    Then limits to what exists in the db if that exists.
    :param proto_message: The protobuf class not an object we are grabbing fields from.
    :param blacklist_field_names: Fields we do not want included.
    :param blacklist_message_types: Message types we do not want included.
    :param db_object: The database object that is being unioned with the protobuf
    :param whitelist_field_names A list of field names that are the only ones allowed.
    :param whitelist_message_types A list of field types that are the only ones allowed.
    :return: A list of fields that can be used to go between protobuf and the database.
    """
    field_list = get_proto_fields_as_flatten_list(proto_message)

    if whitelist_field_names is not None or whitelist_message_types is not None:
        field_list = get_whitelist_proto_union(field_list, whitelist_field_names, whitelist_message_types)

    if blacklist_field_names is not None or blacklist_message_types is not None:
        field_list = filter_proto_fields(field_list, blacklist_field_names, blacklist_message_types)

    if db_object is not None:
        field_list = get_db_proto_union(field_list, db_object)

    return field_list


def get_proto_values(proto_object, fields: List[ProtoFieldResult]) -> List[any]:
    """
    Returns all proto values specified by a list of ProtoFieldResult
    :param proto_object:
    :param fields:
    :return:
    """
    resulting_values = []
    for field in fields:
        current_object = proto_object
        if field.nested_names is not None:
            for field_name in field.nested_names:
                current_object = getattr(current_object, field_name)
        value = getattr(current_object, field.field_name)
        if math.isnan(value):
            value = 0
        resulting_values.append(value)
    return resulting_values


def add_dynamic_fields(names):
    return [DynamicFieldResult(name) for name in names]


if __name__ == "__main__":
    test_list = get_proto_fields_as_flatten_list(player_pb2.Player)
    test_list = filter_proto_fields(test_list, ['name', 'title_id', 'is_orange', 'load_out_id'],
                                    ['api.metadata.CameraSettings', 'api.PlayerId'])

    test_list = get_db_proto_union(test_list, PlayerGame)
    print(test_list)
    values = get_proto_values(player_pb2.Player(), test_list)
    print(values)

from typing import List
from google.protobuf.descriptor import FieldDescriptor
from google.protobuf import message

from backend.database.objects import DBObjectBase, PlayerGame
from carball.generated.api import player_pb2


class ProtoFieldResult:
    def __init__(self, nested_parents, field_name, field_descriptor, nested_names=None):
        self.field_descriptor = field_descriptor
        self.field_name = field_name
        self.nested_parents = nested_parents
        self.nested_names = nested_names


class DynamicFieldResult:
    def __init__(self, field_name):
        self.field_name = field_name


def get_proto_fields_as_flatten_list(proto_message: message, nested_parents=None, nested_fields=None) -> List[ProtoFieldResult]:
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
        for name in blacklist_field_names:
            if name == item.field_name:
                allowed = False
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


def create_and_filter_proto_field(proto_message: message, blacklist_field_names: List[str],
                                  blacklist_message_types: List[str], db_object: DBObjectBase) -> List[ProtoFieldResult]:
    """
    Creates a flatten list of the union of protobuf and db objects.
    :param proto_message: The protobuf class not an object we are grabbing fields from.
    :param blacklist_field_names: Fields we do not want included.
    :param blacklist_message_types: Message types we do not want included.
    :param db_object: The database object that is being unioned with the protobuf
    :return: A list of fields that can be used to go between protobuf and the database.
    """
    list = get_proto_fields_as_flatten_list(proto_message)
    list = filter_proto_fields(list, blacklist_field_names, blacklist_message_types)
    return get_db_proto_union(list, db_object)


def get_proto_values(proto_object, fields: List[ProtoFieldResult]):
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
        resulting_values.append(getattr(current_object, field.field_name))
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

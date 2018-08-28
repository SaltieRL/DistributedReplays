from typing import List
from google.protobuf.descriptor import FieldDescriptor
from google.protobuf import message

from database.objects import DBObjectBase, PlayerGame
from replayanalysis.replay_analysis.generated.api import player_pb2


class ProtoFieldResult:
    def __init__(self, nested_parents, field_name, field_descriptor, value=None):
        self.field_descriptor = field_descriptor
        self.field_name = field_name
        self.nested_parents = nested_parents
        self.value = value


class DynamicFieldResult:
    def __init__(self, field_name):
        self.field_name = field_name


def get_proto_fields_as_flatten_list(proto_message: message, nested_parents=None) -> List[ProtoFieldResult]:
    list = []
    message_name = proto_message.DESCRIPTOR.full_name
    if nested_parents is None:
        nested_parents = [message_name]
    else:
        nested_parents = nested_parents + [message_name]

    for field in proto_message.DESCRIPTOR.fields:
        value = getattr(proto_message, field.name)
        if field.type == FieldDescriptor.TYPE_MESSAGE and isinstance(value, message.Message):
            results = get_proto_fields_as_flatten_list(getattr(proto_message, field.name), nested_parents)
            list += results
        else:
            list.append(ProtoFieldResult(nested_parents, field.name, field, getattr(proto_message, field.name)))
    return list


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
    :param proto_message: The protobuf message we are grabbing fields from.
    :param blacklist_field_names: Fields we do not want included.
    :param blacklist_message_types: Message types we do not want included.
    :param db_object: The database object that is being unioned with the protobuf
    :return: A list of fields that can be used to go between protobuf and the database.
    """
    list = get_proto_fields_as_flatten_list(proto_message)
    list = filter_proto_fields(list, blacklist_field_names, blacklist_message_types)
    return get_db_proto_union(list, db_object)


def add_dynamic_fields(names):
    return [DynamicFieldResult(name) for name in names]

if __name__ == "__main__":
    list = get_proto_fields_as_flatten_list(player_pb2.Player)
    list = filter_proto_fields(list, ['name', 'title_id', 'is_orange'],
                               ['api.metadata.CameraSettings', 'api.metadata.PlayerLoadout', 'api.PlayerId'])

    list = get_db_proto_union(list, PlayerGame)
    print(list)

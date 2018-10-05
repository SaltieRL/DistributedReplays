from typing import Dict, List

from backend.database.utils.dynamic_field_manager import DynamicFieldResult


class FieldExplanation:
    def __init__(self, field_name: str, simple_explanation: str,
                 field_rename: str = None, math_explanation: str = None, file_creation: str = None):
        self.field_rename = field_rename
        self.field_name = field_name
        self.simple_explanation = simple_explanation
        self.math_explanation = math_explanation
        self.file_creation = file_creation


class QueryFieldWrapper:
    def __init__(self, query: any, dynamic_field: DynamicFieldResult,
                 explanation: FieldExplanation = None, is_percent=False, is_boolean=False, is_cumulative=False):
        self.is_cumulative = is_cumulative
        self.is_boolean = is_boolean
        self.is_percent = is_percent
        self.query = query
        self.explanation = explanation
        self.is_averaged = None
        self.dynamic_field = dynamic_field

    def get_query_key(self) -> str:
        return self.dynamic_field.field_name

    def get_field_name(self) -> str:
        """
        :return: The field name or the rename
        """
        if self.explanation is not None and self.explanation.field_rename is not None:
            return self.explanation.field_rename
        else:
            return self.dynamic_field.field_name


def get_explanations(dynamic_field_list) -> (Dict[str, FieldExplanation], List[FieldExplanation]):
    field_list = [
        FieldExplanation('possession_time', 'Duration the ball was last touched by player', field_rename='possession'),
        FieldExplanation('average_speed', 'The average speed of the player in a game', field_rename='speed'),
        FieldExplanation('total_passes', 'Total passes that took place in a game', field_rename='passes'),
        FieldExplanation('total_hits', 'Total number of hits that took place in a game', field_rename='hits'),
        FieldExplanation('total_aerials', 'Total number of aerials that took place in a game', field_rename='aerials'),
        FieldExplanation('total_dribbles', 'Total number of dribbles that took place in a game',
                         field_rename='dribbles'),
        FieldExplanation('average_hit_distance', 'Total number of aerials that took place in a game',
                         field_rename='avg hit dist'),
    ]
    explanation_map = dict()
    for field in field_list:
        explanation_map[field.field_name] = field

    for field in dynamic_field_list:
        if field.field_name not in explanation_map:
            rename = field.field_name.replace('_', ' ')
            explanation = FieldExplanation(field.field_name, field.field_name, field_rename=rename)
            field_list.append(explanation)
            explanation_map[explanation.field_name] = explanation

    return field_list, explanation_map

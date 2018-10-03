from backend.database.utils.dynamic_field_manager import DynamicFieldResult


class FieldExplanation:
    def __init__(self, field_name: str, simple_explanation: str, math_explanation: str, file_creation: str):
        self.field_name = field_name
        self.simple_explanation = simple_explanation
        self.math_explanation = math_explanation
        self.file_creation = file_creation


class QueryFieldWrapper:
    def __init__(self, query: any, dynamic_field: DynamicFieldResult,
                 explanation: FieldExplanation=None, is_percent=False, is_boolean=False):
        self.is_boolean = is_boolean
        self.is_percent = is_percent
        self.query = query
        self.explanation = explanation
        self.is_averaged = None
        self.dynamic_field = dynamic_field

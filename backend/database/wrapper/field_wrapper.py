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

    def to_dict(self):
        return self.__dict__


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
            return self.dynamic_field.field_name.replace('_', ' ')


def get_explanations(dynamic_field_list) -> (Dict[str, FieldExplanation], List[FieldExplanation]):
    field_list = [
        FieldExplanation('total_passes', 'Total passes that took place in a game', field_rename='passes'),
        FieldExplanation('total_hits', 'Total number of hits that took place in a game (using hit detection*)',
                         field_rename='hits'),
        FieldExplanation('total_dribble_conts ', 'This is the second, third, … touch of a dribble'),
        FieldExplanation('total_aerials', 'Total number of aerials that took place in a game', field_rename='aerials'),
        FieldExplanation('total_dribbles', 'Total number of dribbles that took place in a game',
                         field_rename='dribbles'),
        FieldExplanation('useful hits',
                         'Average distance the ball went after being hit before being touched by another player',
                         field_rename='avg hit dist'),

        # turnovers
        FieldExplanation('turnovers',
                         'Lost possession to the other team. Exactly defined as the other team hitting the ball twice'
                         ' in a row'),
        FieldExplanation('turnovers_on_my_half',
                         'Turnovers that occur on the defending half'),
        FieldExplanation('turnovers_on_their_half',
                         'Turnovers that occur on the opponents half'),
        FieldExplanation('won_turnovers',
                         'This player is the first hit that gained possession back from the other team',
                         field_rename='takeaways'),
        FieldExplanation('possession_time',
                         'Time this player had the ball. This continues until another hits the ball'
                         'or play is stopped.', field_rename='possession'),

        # averages
        FieldExplanation('average_speed',
                         'The average speed of your car during the entire game', field_rename='speed'),
        FieldExplanation('average_hit_distance',
                         'Average distance the ball went after being hit, before being touched by another player',
                         field_rename='avg hit dist'),
        FieldExplanation('average_distance_from_center',
                         'Average distance from the team\'s positional center.'),

        # boost
        FieldExplanation('boost_usage',
                         'Total boost used during game.  Accurate within 3% in the worst case.'),
        FieldExplanation('num_small_boosts',
                         'The number of small boost pads collected.'),
        FieldExplanation('num_large_boosts',
                         'The number of large boost pads collected.'),
        FieldExplanation('num_stolen_boosts',
                         'The number of large pads collected on the enemy\'s half.'),
        FieldExplanation('wasted_collection',
                         'Boost collected that goes beyond 100%. '
                         'ex: if you were at 95% and collect a full 100 boost pad you just wasted 95 collected boost.'),
        FieldExplanation('wasted_usage',
                         'Boost used when supersonic.'),
        FieldExplanation('time_full_boost',
                         'Time in the game with 100 boost.'),
        FieldExplanation('time_low_boost',
                         'Time in the game with <25 boost.'),
        FieldExplanation('time_no_boost',
                         'Time in the game with 0 boost.'),

        # tendencies
        FieldExplanation('time_on_ground',
                         'Total time spent on the ground'),
        FieldExplanation('time_low_in_air',
                         'Total time spent above ground but below the max height of '
                         'double jumping (roughly goal height)'),
        FieldExplanation('time_in_defending_half',
                         'Total time the player is in the defending half'),
        FieldExplanation('time_in_attacking_half',
                         'Total time the player is in the opponents\' half'),
        FieldExplanation('time_in_defending_third',
                         'Total time the player is in the defending third of the field.'),
        FieldExplanation('time_in_neutral_third',
                         'Total time the player is in the midfield.'),
        FieldExplanation('time_in_attacking_third',
                         'Total time the player is in the enemy third of the field.'),
        FieldExplanation('time_behind_ball',
                         '(< ball) Time the player is between the ball and their own goal.'),
        FieldExplanation('time_in_font_of_ball',
                         '(> ball) Time the player is between the ball and the opponents\' goal.'),
        FieldExplanation('time_closest_to_ball',
                         'Time spent closer to the ball than any other player.'),
        FieldExplanation('time_furthest_from_ball',
                         'Time spent farther from the ball than any other player.'),
        FieldExplanation('time_close_to_ball',
                         'Time the player is near the ball (equivalent to half the length of a goal)'),
        FieldExplanation('time_closest_to_team_center',
                         'Time when a player is closest to the positional center of their team'),
        FieldExplanation('time_furthest_from_team_center',
                         'Time when a player is furthest to the positional center of their team'),

        # distance
        FieldExplanation('ball_hit_forward',
                         'Summed distance of hits towards opponent goal.'),
        FieldExplanation('ball_hit_backward',
                         'Summed distance of hits towards own goal.'),

        FieldExplanation('is_keyboard',
                         'If the player is using a keyboard.'),

        # speed
        FieldExplanation('time_at_boost_speed',
                         'Time at a speed only reachable by using boost (or flips).'),
        FieldExplanation('time_at_slow_speed',
                         'Time at half the car speed reachable by just driving.'),
        FieldExplanation('time_at_super_sonic',
                         'Time at max car speed. Trail is showing.'),

        FieldExplanation('boost ratio',
                         'Ratio of small boost pad pickups to large pickups.'),
        FieldExplanation('collection boost efficiency',
                         '1 - wasted collected boost / total boost collected'),
        FieldExplanation('used boost efficiency',
                         '1 - wasted used boost / total boost usage'),
        FieldExplanation('total boost efficiency',
                         '1 - total wasted / total boost collected'),
        FieldExplanation('turnover efficiency',
                         'Percentage of hits that were not turnovers.'),

    ]
    explanation_map = dict()
    for field in field_list:
        if field.field_rename is None:
            field.field_rename = field.field_name.replace('_', ' ')
        explanation_map[field.field_name] = field

    for field in dynamic_field_list:
        if field.field_name not in explanation_map:
            rename = field.field_name.replace('_', ' ')
            explanation = FieldExplanation(field.field_name, field.field_name, field_rename=rename)
            field_list.append(explanation)
            explanation_map[explanation.field_name] = explanation

    return field_list, explanation_map

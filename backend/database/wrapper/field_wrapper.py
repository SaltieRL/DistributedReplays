from typing import Dict, List

from backend.database.utils.dynamic_field_manager import DynamicFieldResult


class FieldExplanation:
    def __init__(self, field_name: str, simple_explanation: str,
                 field_rename: str = None, math_explanation: str = None, file_creation: str = None,
                 short_name: str = None):
        self.field_rename = field_rename
        self.field_name = field_name
        self.simple_explanation = simple_explanation
        self.math_explanation = math_explanation
        self.file_creation = file_creation
        self.short_name = short_name


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
        FieldExplanation('assists', 'Total number of passes that led to goals.'),
        FieldExplanation('shots', 'Total number of hits towards the enemy goal.'),
        FieldExplanation('total_passes', 'Total hits followed by a teammate hit.', field_rename='passes'),
        FieldExplanation('total_hits', 'Total number of hits (using hit detection).',
                         field_rename='hits'),
        FieldExplanation('total_dribble_conts ', 'Total amount of dribble continuations or consecutive touches with the ball.'),
        FieldExplanation('total_aerials', 'Number of hits > than the height of the goal.', field_rename='aerials'),
        FieldExplanation('total_dribbles', 'Number of dribbles.',
                         field_rename='dribbles'),
        FieldExplanation('useful/hits',
                         'Number of shots/passes/saves out of total hits.',
                         math_explanation='\\frac{100 \\times (\\textrm{shots} + \\textrm{passes} + \\textrm{saves} + \\textrm{goals})}{\\textrm{total hits} - \\textrm{total dribble hits}}'),
        FieldExplanation('shots/hit',
                         'Number of shots per hit.',
                         math_explanation='\\frac{100 \\times \\textrm{shots}}{\\textrm{total hits} - \\textrm{total dribble hits}}'),
        FieldExplanation('assists/hit',
                         'Number of assists per hit.',
                         math_explanation='\\frac{100 \\times \\textrm{assists}}{\\textrm{total hits} - \\textrm{total dribble hits}}'),
        FieldExplanation('passes/hit',
                         'Number of passes per hit.',
                         math_explanation='\\frac{100 \\times \\textrm{passes}}{\\textrm{total hits} - \\textrm{total dribble hits}}'),

        # turnovers
        FieldExplanation('turnovers',
                         'Number of lost possessions to the other team. Defined as the other team hitting the ball '
                         'twice in a row after the player\'s hit.'),
        FieldExplanation('turnovers_on_my_half',
                         'Turnovers that occur on the defending half.'),
        FieldExplanation('turnovers_on_their_half',
                         'Turnovers that occur on the offensive half.'),
        FieldExplanation('won_turnovers',
                         'Number of first hits that gained possession back from the other team.',
                         field_rename='takeaways'),
        FieldExplanation('possession_time',
                         'Time this player had the ball. This continues until another hits the ball'
                         'or play is stopped.', field_rename='possession time', short_name='possession'),
        FieldExplanation('turnover_efficiency',
                         'Percentage of hits that were not turnovers.',
                         short_name='turnover eff'),

        # averages
        FieldExplanation('average_speed',
                         'The average speed of your car during the entire game.', field_rename='speed'),
        FieldExplanation('average_hit_distance',
                         'Average distance the ball went after being hit, before being touched by another player.',
                         math_explanation='\\frac{\\textrm{total hit distance}}{\\textrm{total hits}}',
                         short_name='avg hit dist'),
        FieldExplanation('average_distance_from_center',
                         'Average distance from the team\'s positional center.'),

        # boost
        FieldExplanation('boost_usage',
                         'Total boost used during the game. Accurate within 3% in the worst case.'),
        FieldExplanation('num_small_boosts',
                         'The number of small boost pads collected.'),
        FieldExplanation('num_large_boosts',
                         'The number of large boost pads collected.'),
        FieldExplanation('num_stolen_boosts',
                         'The number of large pads collected on the enemy\'s half.'),
        FieldExplanation('wasted_collection',
                         'The amount of boost collected that goes beyond 100%. '
                         'Ex: if you were at 95% and collect a full 100 boost pad you just wasted 95 collected boost.'),
        FieldExplanation('wasted_usage',
                         'The amount of boost used when supersonic.'),
        FieldExplanation('time_full_boost',
                         'Total time in the game with 100 boost.'),
        FieldExplanation('time_low_boost',
                         'Total time in the game with <25 boost.'),
        FieldExplanation('time_no_boost',
                         'Total time in the game with 0 boost.'),

        # tendencies
        FieldExplanation('time_on_ground',
                         'Total time spent on the ground.'),
        FieldExplanation('time_low_in_air',
                         'Total time spent above ground but below the max height of '
                         'double jumping (roughly goal height).'),
        FieldExplanation('time_high_in_air',
                         'Total time spent above the max height of '
                         'double jumping (roughly goal height).'),
        FieldExplanation('time_in_defending_half',
                         'Total time the player is in the defending half.',
                         short_name='def 1/2'),
        FieldExplanation('time_in_attacking_half',
                         'Total time the player is in the offensive half.',
                         short_name='att 1/2'),
        FieldExplanation('time_in_defending_third',
                         'Total time the player is in the defending third of the field.',
                         short_name='def 1/3'),
        FieldExplanation('time_in_neutral_third',
                         'Total time the player is in the midfield.',
                         short_name='mid 1/3'),
        FieldExplanation('time_in_attacking_third',
                         'Total time the player is in the offensive third of the field.',
                         short_name='att 1/3'),
        FieldExplanation('time_behind_ball',
                         '(< ball) Time the player is between the ball and their own goal.',
                         short_name='< ball'),
        FieldExplanation('time_in_front_ball',
                         '(> ball) Time the player is between the ball and the opponents\' goal.',
                         short_name='> ball'),
        FieldExplanation('time_closest_to_ball',
                         'Total time being the closest player to the ball.'),
        FieldExplanation('time_furthest_from_ball',
                         'Total time being the further player from the ball.'),
        FieldExplanation('time_close_to_ball',
                         'Total time being near the ball (equivalent to half the length of a goal).'),
        FieldExplanation('time_closest_to_team_center',
                         'Total time being the player closest to the positional center of their team.'),
        FieldExplanation('time_furthest_from_team_center',
                         'Total time being the player furthest from the positional center of their team.'),
        FieldExplanation('time_in_corner',
                         'Total time spent in the corners of the pitch.'),
        FieldExplanation('time_near_wall',
                         'Total time spent near the walls of the pitch.'),

        # distance
        FieldExplanation('ball_hit_forward',
                         'Summed distance of hits towards opponent goal.'),
        FieldExplanation('ball_hit_backward',
                         'Summed distance of hits towards own goal.'),

        # team positioning
        FieldExplanation('time_in_front_of_center_of_mass',
                         'Total time the player is in front of the relative center of the team\'s positioning.'),
        FieldExplanation('time_behind_center_of_mass',
                         'Total time the player is behind the relative center of the team\'s positioning.'),
        FieldExplanation('time_between_players',
                         'Total time the player positioned between teammates (when the player is not the most forward or most backward player).',
                         math_explanation='\\textrm{time in game}-(\\textrm{time most back player}+\\textrm{time most forward player})'),
        FieldExplanation('time_most_back_player',
                         'Total time the player is positioned as the most back player of the team.'),
        FieldExplanation('time_most_forward_player',
                         'Total time the player is positioned as the most forward player of the team.'),

        # speed
        FieldExplanation('time_at_boost_speed',
                         'Total time driving at any speed higher than maximum speed obtained by just pure throttle.'
                         'Achieved via dodges or boosting.'),
        FieldExplanation('time_at_slow_speed',
                         'Total time at half the maximum car speed obtained by just pure throttle.'),
        FieldExplanation('time_at_super_sonic',
                         'Total time at true max car speed of 2300 uu/s (83 kph or 51 mph).'
                         'Achieved by tapping boost for a short time after the super sonic trail is showing.'),

        FieldExplanation('boost_ratio',
                         'Ratio of small boost pad pickups to large pickups.',
                         math_explanation='\\frac{\\textrm{num small boosts}}{\\textrm{num large boosts}}'),
        FieldExplanation('collection_boost_efficiency',
                         'How efficient the player is at collecting boost.',
                         math_explanation='1 - '
                                          '\\frac{\\textrm{wasted collected boost}}{\\textrm{total boost collected}}',
                         short_name='bst clct eff'),
        FieldExplanation('used_boost_efficiency',
                         'How efficient the player is at using boost.',
                         math_explanation='1 - \\frac{\\textrm{wasted used boost}}{\\textrm{total boost usage}}',
                         short_name='bst use eff'),
        FieldExplanation('total_boost_efficiency',
                         'How efficient the player is at using and collecting boost.',
                         math_explanation='1 - \\frac{\\textrm{wasted used boost} + '
                                          '\\textrm{wasted collected boost}}{100 \\times \\textrm{num large boosts}'
                                          ' + 12 \\times \\textrm{num small boosts}}',
                         short_name='boost efficiency'),
        FieldExplanation('average_boost_level',
                         'Average amount of boost this player possessed over the entire game.'),
        FieldExplanation('wasted_big',
                         'Amount of wasted boost from big boosts.',
                         math_explanation='100 - \\textrm{amount of boost in tank}'),
        FieldExplanation('wasted_small',
                         'Amount of wasted boost from small boosts.'),
        FieldExplanation('aerial_efficiency',
                         'Ratio of aerials to time in the air',
                         math_explanation='\\frac{\\textrm{total aerials}}'
                                          '{\\textrm{time high in air + time low in air}}',
                         short_name='aerial eff'),
        FieldExplanation('shot_%',
                         'Ratio of goals to shots',
                         math_explanation='\\frac{\\textrm{total goals}}{\\textrm{total shots}}'),
        FieldExplanation('rank',
                         'Average rank of all games in all playlists.'),
        FieldExplanation('mmr',
                         'MMR of the player for the given playlist.'),

        #misc stats
        FieldExplanation('first_frame_in_game',
                         'First frame where the player is completely loaded in the game and is able to interact with physics.'),
        FieldExplanation('is_keyboard',
                         'How likely the player is using a keyboard.'),
        FieldExplanation('time_in_game',
                         'Total amount of time spent in the match in seconds. Normally, 300 seconds but can differ in matches with overtime, '
                         'joining late/leaving early in unranked matches.'),


    ]
    explanation_map = dict()
    for field in field_list:
        if field.field_rename is None:
            field.field_rename = field.field_name.replace('_', ' ')
        if field.short_name is None:
            field.short_name = field.field_rename
        explanation_map[field.field_name] = field

    for field in dynamic_field_list:
        if field.field_name not in explanation_map:
            rename = field.field_name.replace('_', ' ')
            explanation = FieldExplanation(field.field_name, field.field_name, field_rename=rename)
            field_list.append(explanation)
            explanation_map[explanation.field_name] = explanation

    return field_list, explanation_map

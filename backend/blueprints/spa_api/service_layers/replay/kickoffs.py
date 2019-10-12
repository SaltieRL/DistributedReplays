from typing import Dict

from carball.generated.api.game_pb2 import Game
from carball.generated.api.player_pb2 import Player
from carball.generated.api.stats.events_pb2 import Kickoff
from carball.generated.api.stats.kickoff_pb2 import KickoffType

from backend.blueprints.spa_api.service_layers.utils import create_player_map
from backend.utils.file_manager import FileManager


class Kickoffs:

    def __init__(self, replay_id):
        self.replay_id = replay_id
        self.pandas = None

    def create_from_id(self):
        protobuf_game = FileManager.get_proto(self.replay_id)
        kickoffs = protobuf_game.game_stats.kickoff_stats
        player_map = create_player_map(protobuf_game)

        kickoff_data = []
        for i in range(len(kickoffs)):
            kickoff_data.append(self.get_stats_from_kickoff(kickoffs[i], player_map))
        return kickoff_data

    def get_stats_from_kickoff(self, kickoff: Kickoff, player_map: Dict[str, Player]):

        if kickoff.touch is None:
            return {
                'touch_time': kickoff.touch_time,
                'kickoff_type': KickoffType.Name(kickoff.type)
            }

        kickoff_data = {
            'time_till_goal': kickoff.touch.kickoff_goal,
            'first_touch': player_map[kickoff.touch.first_touch_player.id].name,
            'touch_time': kickoff.touch_time,
            'kickoff_type': KickoffType.Name(kickoff.type)
        }

        players = kickoff.touch.players
        for index in range(len(players)):
            player_name = player_map[players[index].player.id].name
            kickoff_data[player_name] = self.get_stats_from_player(players[index], kickoff.start_frame, player_name)

        return kickoff_data

    def get_stats_from_player(self, player, start_frame, player_name):
        if player.start_position is None or player.start_position.pos_y == 0:
            if self.pandas is None:
                self.pandas = FileManager.get_pandas(self.replay_id)
            start_x = self.pandas[player_name]['pos_x'][start_frame]
            start_y = self.pandas[player_name]['pos_y'][start_frame]
        else:
            start_x = player.start_position.pos_x
            start_y = player.start_position.pos_y

        end_x = player.player_position.pos_x
        end_y = player.player_position.pos_y

        return {
            'jumps': [jump for jump in player.jumps],
            'boost_level': player.boost,
            'time_to_boost': player.boost_time,
            'ball_distance': player.ball_dist,
            'start': {
                'x': start_x,
                'y': start_y
            },
            'end': {
                'x': end_x,
                'y': end_y
            }
        }

from typing import Dict

from carball.generated.api.player_pb2 import Player
from carball.generated.api.stats.events_pb2 import Kickoff
from carball.generated.api.stats.kickoff_pb2 import KickoffType, TouchPosition, UNKNOWN_TOUCH_POS

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
        kickoff_list = []
        for i in range(len(kickoffs)):
            kickoff_list.append(self.get_stats_from_kickoff(kickoffs[i], player_map))

        player_list = {}
        for player in protobuf_game.players:
            player_list[player.id.id] = {"name": player.name, "is_orange": player.is_orange}

        kickoff_data = {
            "players": player_list,
            "kickoffs": kickoff_list
        }
        return kickoff_data

    def get_stats_from_kickoff(self, kickoff: Kickoff, player_map: Dict[str, Player]):
        if kickoff.touch is None:
            return {
                'touch_time': kickoff.touch_time,
                'kickoff_type': KickoffType.Name(kickoff.type)
            }

        if kickoff.touch.first_touch_player is None or kickoff.touch.first_touch_player.id == "":
            first_touch = ""
        else:
            first_touch = player_map[kickoff.touch.first_touch_player.id].name

        player_data = []

        players = kickoff.touch.players
        for index in range(len(players)):
            player_name = player_map[players[index].player.id].name
            player_data.append(self.get_stats_from_player(players[index], kickoff.start_frame, player_name))

        kickoff_data = {
            'players': player_data,
            'time_till_goal': kickoff.touch.kickoff_goal,
            'first_touch': first_touch,
            'touch_time': kickoff.touch_time,
            'kickoff_type': KickoffType.Name(kickoff.type)
        }

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
            'player_id': player.player.id,
            'jump_times': [jump for jump in player.jumps],
            'jumps': len(player.jumps),
            'boost_level': round((player.boost / 255.0) * 100.0, 1),
            'time_to_boost': round(player.boost_time, 3),
            'ball_distance': round(player.ball_dist, 2),
            'location': TouchPosition.Name(
                player.touch_position) if player.touch_position != UNKNOWN_TOUCH_POS else "UNKOWN",
            'start': {
                'x': start_x,
                'y': start_y
            },
            'end': {
                'x': end_x,
                'y': end_y
            }
        }

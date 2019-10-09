from carball.generated.api.stats.events_pb2 import Kickoff

from utils.file_manager import FileManager


class Kickoffs:

    def __init__(self, replay_id):
        self.replay_id = replay_id
        self.pandas = None

    class KickoffJson:
        def __init__(self):
            pass

    def create_from_id(self, replay_id: str):
        protobuf_game = FileManager.get_proto(replay_id)
        kickoffs = protobuf_game.game_stats.kickoffs_stats

        kickoff_data = []
        for i in range(len(kickoffs)):
            kickoff_data.append(self.get_stats_from_kickoff(kickoffs[i]))

    def get_stats_from_kickoff(self, kickoff: Kickoff):
        players = kickoff.touch.players
        for index in range(len(players)):
            self.get_stats_from_player(players[index], kickoff.start_frame)

    def get_stats_from_player(self, player, start_frame):
        start_x = None
        start_y = None
        if player.start_position is None:
            if self.pandas is None:
                self.pandas = FileManager.get_pandas(self.replay_id)
            start_x = self.pandas[player.name]['pos_x'][start_frame]
            start_y = self.pandas[player.name]['pos_x'][start_frame]
        else:
            start_x = player.start_position.pos_x
            start_y = player.start_position.pos_y

        end_x = player.touch_position.pos_x
        end_y = player.touch_position.pos_y
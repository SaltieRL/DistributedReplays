from carball.generated.api.stats.events_pb2 import Kickoff

from utils.file_manager import FileManager


class Kickoffs:

    class KickoffJson:
        def __init__(self, ):

    @staticmethod
    def create_from_id(replay_id: str):
        protobuf_game = FileManager.get_proto(replay_id)
        kickoffs = protobuf_game.game_stats.kickoffs


    def get_stats_from_kickoff(self, kickoff: Kickoff):

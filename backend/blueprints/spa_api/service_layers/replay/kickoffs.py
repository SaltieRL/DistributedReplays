from utils.file_manager import FileManager


class Kickoffs:
    @staticmethod
    def create_from_id(replay_id: str):
        protobuf_game = FileManager.get_proto(replay_id)

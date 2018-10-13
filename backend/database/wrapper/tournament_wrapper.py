class TournamentWrapper:
    @staticmethod
    def add_tournament(owner, name):
        pass

    @staticmethod
    def remove_tournament(tournament_id):
        pass

    @staticmethod
    def get_tournament(tournament_id, session=None):
        pass

    @staticmethod
    def add_tournament_stage(tournament_id, stage_name):
        pass

    @staticmethod
    def remove_tournament_stage(tournament_id, stage_name):
        pass

    @staticmethod
    def add_series_to_stage(series_id, stage_id):
        pass

    @staticmethod
    def remove_series_from_stage(series_id, stage_id):
        pass

    @staticmethod
    def add_game_to_series(game_hash, series_id):
        pass

    @staticmethod
    def remove_game_from_series(game_hash, series_id):
        pass
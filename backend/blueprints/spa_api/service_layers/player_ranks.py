from backend.utils.psyonix_api_handler import get_rank


class PlaylistRank:
    def __init__(self, name: str, rank: int, rating: int):
        self.name = name
        self.rank = rank
        self.rating = rating


class PlayerRanks:
    def __init__(self, duel: PlaylistRank, doubles: PlaylistRank, solo: PlaylistRank,
                 standard: PlaylistRank):
        self.duel = duel.__dict__
        self.doubles = doubles.__dict__
        self.solo = solo.__dict__
        self.standard = standard.__dict__

    @staticmethod
    def create_from_id(id_: str) -> 'PlayerRanks':
        rank_datas = get_rank(id_)
        print(rank_datas)
        player_rank_params = {
            rank_data['mode']: PlaylistRank(
                rank_data['string'],
                rank_data['tier'], rank_data['rank_points']
            )
            for rank_data in rank_datas
        }
        return PlayerRanks(**player_rank_params)

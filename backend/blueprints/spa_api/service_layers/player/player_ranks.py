from typing import Dict

from backend.utils.psyonix_api_handler import get_rank


class PlaylistRank:
    def __init__(self, name: str, rank: int, rating: int):
        self.name = name
        self.rank = rank
        self.rating = rating


class PlayerRanks:
    def __init__(self, ranks: Dict[str, PlaylistRank]):
        if 'duel' in ranks and ranks['duel'] is not None:
            self.duel = ranks['duel'].__dict__
        else:
            self.duel = PlaylistRank("Unranked (div 1)", 0, 0).__dict__
        if 'doubles' in ranks and ranks['doubles'] is not None:
            self.doubles = ranks['doubles'].__dict__
        else:
            self.doubles = PlaylistRank("Unranked (div 1)", 0, 0).__dict__
        if 'solo' in ranks and ranks['solo'] is not None:
            self.solo = ranks['solo'].__dict__
        else:
            self.solo = PlaylistRank("Unranked (div 1)", 0, 0).__dict__
        if 'standard' in ranks and ranks['standard'] is not None:
            self.standard = ranks['standard'].__dict__
        else:
            self.standard = PlaylistRank("Unranked (div 1)", 0, 0).__dict__
        if 'hoops' in ranks and ranks['hoops'] is not None:
            self.hoops = ranks['hoops'].__dict__
        else:
            self.hoops = PlaylistRank("Unranked (div 1)", 0, 0).__dict__
        if 'rumble' in ranks and ranks['rumble'] is not None:
            self.rumble = ranks['rumble'].__dict__
        else:
            self.rumble = PlaylistRank("Unranked (div 1)", 0, 0).__dict__
        if 'dropshot' in ranks and ranks['dropshot'] is not None:
            self.dropshot = ranks['dropshot'].__dict__
        else:
            self.dropshot = PlaylistRank("Unranked (div 1)", 0, 0).__dict__
        if 'snowday' in ranks and ranks['snowday'] is not None:
            self.snowday = ranks['snowday'].__dict__
        else:
            self.snowday = PlaylistRank("Unranked (div 1)", 0, 0).__dict__

    @staticmethod
    def create_from_id(id_: str) -> 'PlayerRanks':
        try:
            rank_datas = get_rank(id_)
            # print(rank_datas)
            player_rank_params = {
                rank_data['mode']: PlaylistRank(
                    rank_data['string'],
                    rank_data['tier'], rank_data['rank_points']
                )
                for playlist, rank_data in rank_datas.items()
            }
            return PlayerRanks(player_rank_params)
        except:
            return PlayerRanks(dict())

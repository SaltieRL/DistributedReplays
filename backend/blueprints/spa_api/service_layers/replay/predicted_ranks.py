from typing import List

from backend.blueprints.spa_api.errors.errors import UnsupportedPlaylist
from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import PlayerGame, Game
from backend.utils.checks import is_local_dev

try:
    from backend.blueprints.spa_api.service_layers.ml.ml import model_holder
except ModuleNotFoundError:
    model_holder = None
    print(
        "Not using ML because required packages are not installed. Run `pip install -r requirements-ml.txt` to use ML.")


class PredictedRank:
    def __init__(self, id_: str, predicted_rank: int):
        self.id = id_
        self.predictedRank = predicted_rank

    @staticmethod
    @with_session
    def create_from_id(id_: str, session=None) -> List['PredictedRank']:
        """
        :param id_: Replay id
        :param session:
        :return: List of PredictedRanksTable
        """
        if model_holder is None:
            print("Not using ML, model holder is None.")
            # raise Exception('ML not loaded for predicted ranks.')

        game: Game = session.query(Game).filter(Game.hash == id_).first()
        accepted_playlists = [
            13,  # standard
            3,  # unranked standard
            6,  # custom,
            11,  # doubles
            2,  # unranked doubles
            10,
            1
        ]
        if game.playlist not in accepted_playlists:
            raise UnsupportedPlaylist

        playergames = session.query(PlayerGame).filter(PlayerGame.game == id_).all()
        adjusted_playlist_map = {
            2: 11,
            11: 11,
            3: 13,
            6: 13,
            13: 13,
            10: 10,
            1: 10
        }
        playlist = adjusted_playlist_map[game.playlist]
        if game.playlist == 6 and len(game.players) == 4:
            playlist = 11
        elif game.playlist == 6 and len(game.players) == 2:
            playlist = 10
        if is_local_dev():
            import random
            ranks = [
                PredictedRank(pg.player, random.randint(0, 19))
                for pg in playergames
            ]
        else:
            ranks = [
                PredictedRank(pg.player, model_holder.predict_rank(pg, playlist=playlist))
                for pg in playergames
            ]
        return ranks

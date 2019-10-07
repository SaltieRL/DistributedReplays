import datetime
import os

from sqlalchemy import desc

from backend.database.objects import Playlist, PlayerGame, Game, TrainingPack
from backend.tasks.training_packs.training_packs import create_pack_from_replays
from backend.utils.cloud_handler import upload_training_pack

playlists = [
    Playlist.UNRANKED_DUELS,
    Playlist.UNRANKED_DOUBLES,
    Playlist.UNRANKED_STANDARD,
    Playlist.UNRANKED_CHAOS,
    Playlist.CUSTOM_LOBBY,
    Playlist.RANKED_DUELS,
    Playlist.RANKED_DOUBLES,
    Playlist.RANKED_SOLO_STANDARD,
    Playlist.RANKED_STANDARD
]
maps = [
    "eurostadium_snownight_p",
    "Wasteland_Night_P",
    "EuroStadium_P",
    "stadium_winter_p",
    "Stadium_P",
    "beach_P",
    "NeoTokyo_P",
    "cs_day_p",
    "Stadium_p",
    "TrainStation_Night_P",
    "cs_hw_p",
    "Park_P",
    "Neotokyo_p",
    "park_p",
    "eurostadium_night_p",
    "streethoops2",
    "Park_Night_P",
    "cs_p",
    "utopiastadium_p",
    "TrainStation_P",
    "Stadium_Foggy_P",
    "beach_night_p",
    "stadium_day_p",
    "eurostadium_p",
    "farm_p",
    "Stadium_Winter_P",
    "EuroStadium_Night_P",
    "Utopiastadium_p",
    "UtopiaStadium_Snow_P",
    "stadium_p",
    "UtopiaStadium_Snow_p",
    "UtopiaStadium_Dusk_p",
    "Underwater_p",
    "NeoTokyo_Standard_P",
    "trainstation_p",
    "EuroStadium_Rainy_P",
    "arc_standard_p",
    "UtopiaStadium_P",
    "TrainStation_Dawn_P",
    "wasteland_s_p",
    "UtopiaStadium_Dusk_P",
    "Underwater_P",
    "wasteland_Night_S_P",
    "Park_Rainy_P",
    "Trainstation_Night_P",
    "stadium_foggy_p",
    "Wasteland_p",
]


class TrainingPackCreation:
    @staticmethod
    def create_from_player(id_, n=10, date_start=None, date_end=None, sess=None):
        # filter to standard maps and standard playlists (to exclude ranked rumble)
        # we can't get everything but this covers everything but custom games in private matches
        query = sess.query(PlayerGame.game) \
            .join(Game, Game.hash == PlayerGame.game) \
            .filter(PlayerGame.player == id_) \
            .filter(Game.map.in_(maps)) \
            .filter(Game.playlist.in_(list(playlist.value for playlist in playlists)))
        if date_start is not None:
            query = query.filter(Game.match_date >= date_start).filter(
                Game.match_date <= date_end + datetime.timedelta(days=1))
        last_n_games = query.order_by(desc(Game.match_date))
        if date_start is not None:
            last_n_games = last_n_games.all()  # we don't want to overdo it, but we want to max the pack
        else:
            last_n_games = last_n_games[:n]  # use default of last n games
        last_n_games = [game[0] for game in last_n_games]  # gets rid of tuples
        result = create_pack_from_replays(last_n_games, id_)
        if result is None:
            return None
        filename, shots = result
        print("File:", filename)
        url = upload_training_pack(filename)
        print("URL:", url)
        os.remove(filename)
        guid = os.path.basename(filename).replace('.Tem', '')
        tp = TrainingPack(guid=guid, player=id_, shots=shots)
        sess.add(tp)
        sess.commit()

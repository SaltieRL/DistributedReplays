import datetime
import logging
import os

from sqlalchemy import desc

from backend.blueprints.spa_api.errors.errors import UserHasNoReplays
from backend.blueprints.spa_api.service_layers.replay.replay import Replay
from backend.database.objects import Playlist, PlayerGame, Game, TrainingPack
from backend.tasks.training_packs.training_packs import create_pack_from_replays, create_custom_pack_from_replays
from backend.utils.cloud_handler import upload_training_pack

try:
    from config import TRAINING_PACK_BUCKET
except:
    TRAINING_PACK_BUCKET = None

logger = logging.getLogger(__name__)
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
    def create_from_player(task_id, requester_id, pack_player_id, n=10, date_start=None, date_end=None, name=None,
                           replays=None,
                           sess=None):
        # filter to standard maps and standard playlists (to exclude ranked rumble)
        # we can't get everything but this covers everything but custom games in private matches
        if replays is None:
            query = sess.query(PlayerGame.game) \
                .join(Game, Game.hash == PlayerGame.game) \
                .filter(PlayerGame.player == pack_player_id) \
                .filter(Game.map.in_(maps)) \
                .filter(Game.playlist.in_(list(playlist.value for playlist in playlists)))
            if date_start is not None:
                date_start = datetime.date.fromtimestamp(float(date_start))
                date_end = datetime.date.fromtimestamp(float(date_end))
                query = query.filter(Game.match_date >= date_start).filter(
                    Game.match_date <= date_end + datetime.timedelta(days=1))
            last_n_games = query.order_by(desc(Game.match_date))
            if query.count() == 0:
                raise UserHasNoReplays()
            if date_start is not None:
                last_n_games = last_n_games.all()  # we don't want to overdo it, but we want to max the pack
            else:
                last_n_games = last_n_games[:n]  # use default of last n games
            last_n_games = [game[0] for game in last_n_games]  # gets rid of tuples
        else:
            print(replays)
            last_n_games = replays
        if name is None or name == "":
            name = f"{pack_player_id} {datetime.datetime.now().strftime('%d/%m/%y %H:%M')}"
        result = create_pack_from_replays(last_n_games, pack_player_id, name)
        if result is None:
            return None
        TrainingPackCreation.upload_and_commit_pack(name, pack_player_id, requester_id, result, sess, task_id)

    @staticmethod
    def upload_and_commit_pack(name, pack_player_id, requester_id, result, sess, task_id):
        filename, shots = result
        logger.info("File: " + str(filename))
        url = upload_training_pack(filename)
        logger.info("URL: " + str(url))
        os.remove(filename)
        guid = os.path.basename(filename).replace('.Tem', '')
        tp = TrainingPack(guid=guid, name=name, player=requester_id, pack_player=pack_player_id, shots=shots,
                          task_id=task_id)
        sess.add(tp)
        sess.commit()

    @staticmethod
    def create_custom_pack(task_id, requester_id, players, replays, frames, name=None, mode=False,
                           sess=None):
        if name is None or name == "":
            name = f"Custom Pack {datetime.datetime.now().strftime('%d/%m/%y %H:%M')}"
        result = create_custom_pack_from_replays(replays, players, frames, name, mode=mode)
        if result is None:
            return None
        TrainingPackCreation.upload_and_commit_pack(name, "0", requester_id, result, sess, task_id)

    @staticmethod
    def list_packs(id_, session):
        packs = session.query(TrainingPack).filter(TrainingPack.player == id_).order_by(
            desc(TrainingPack.creation_date))
        return TrainingPackCreation.create_pack_response(packs.all(), packs.count(), session)

    @staticmethod
    def poll_pack(id_, session):
        pack_query = session.query(TrainingPack).filter(TrainingPack.task_id == id_).order_by(
            desc(TrainingPack.creation_date))
        packs_list = pack_query.all()

        return TrainingPackCreation.create_pack_response(packs_list, pack_query.count(), session)

    @staticmethod
    def create_pack_response(packs_list, count, session):
        # gets list of games from each pack
        games = [[shot['game'] for shot in p.shots] for p in packs_list]
        # flatten the list and remove duplicates
        games = list(set([val for sublist in games for val in sublist]))
        # get all of these games only once
        game_list = session.query(Game).filter(Game.hash.in_(games)).all()
        # create a map for the frontend to deal with
        game_map = {game.hash: Replay.create_from_game(game).__dict__ for game in game_list}
        return {'games': game_map,
                'packs': [
                    {
                        'guid': p.guid,
                        'shots': p.shots,
                        'date': p.creation_date,
                        'name': p.name,
                        'link': f'https://storage.googleapis.com/{TRAINING_PACK_BUCKET}/{p.guid}.Tem'
                    } for p in packs_list
                ],
                'totalCount': count}

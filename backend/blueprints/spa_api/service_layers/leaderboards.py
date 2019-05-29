import datetime
from typing import List, NamedTuple, Dict

from sqlalchemy import func, desc

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.blueprints.steam import get_steam_profile_or_random_response
from backend.database.objects import PlayerGame, Game, Player, Playlist


class Leader:
    def __init__(self, name: str, id_: str, count: int, avatar: str):
        self.name = name
        self.id_ = id_
        self.count = count
        self.avatar = avatar


class Duration(NamedTuple):
    name: str
    days: int


class PlaylistLeaderboard:
    def __init__(self, playlist: Playlist, leaders: Dict[Duration, List[Leader]]):
        self.playlist: int = playlist.value
        self.leaders: Dict[str, List[Leader]] = {
            duration.name: _leaders
            for duration, _leaders in leaders.items()
        }


class Leaderboards:
    @staticmethod
    @with_session
    def create(session=None) -> List[PlaylistLeaderboard]:
        durations = [Duration('week', 7), Duration('month', 30)]
        q = session.query(PlayerGame.player, func.count(PlayerGame.player).label('count')) \
            .join(Game, Game.hash == PlayerGame.game).group_by(PlayerGame.player).order_by(desc('count'))
        playlist_leaderboards = []
        for playlist in Playlist:
            filtered_playlist = q.filter(Game.playlist == playlist.value)
            duration_leaders: Dict[Duration, List[Leader]] = {}
            for duration in durations:
                start = datetime.datetime.now() - datetime.timedelta(days=duration.days)
                leaders_query_result = filtered_playlist.filter(Game.match_date > start)[:10]
                leaders = []
                for leader in leaders_query_result:
                    player = session.query(Player).filter(Player.platformid == leader[0]).first()
                    if player.avatar == "":
                        # this will update the DB for future calls, we just want it temporarily
                        profile = get_steam_profile_or_random_response(player.platformid)
                        player.avatar = profile['response']['players'][0]['avatarfull']
                    leaders.append(
                        Leader(name=player.platformname if player.platformname != "" else leader[0],
                               id_=leader[0],
                               count=leader[1],
                               avatar=player.avatar
                               )
                    )
                duration_leaders[duration] = leaders
            playlist_leaderboards.append(PlaylistLeaderboard(playlist, duration_leaders))
        return playlist_leaderboards

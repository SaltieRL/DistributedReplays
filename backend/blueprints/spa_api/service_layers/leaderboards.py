import datetime

from sqlalchemy import func, desc

from backend.blueprints.spa_api.service_layers.utils import with_session
from backend.database.objects import PlayerGame, Game, Player, Playlist


class Leaderboards:
    @staticmethod
    @with_session
    def create(session=None):
        days_to_filter_by = [7, 30]
        day_names = ['week', 'month']
        playlists_to_filter_by = [playlist.value for playlist in Playlist]
        q = session.query(PlayerGame.player, func.count(PlayerGame.player).label('count'))\
            .join(Game, Game.hash == PlayerGame.game).group_by(PlayerGame.player).order_by(desc('count'))
        result = {}
        for playlist in playlists_to_filter_by:
            filtered_playlist = q.filter(Game.playlist == playlist)
            result[playlist] = {}
            for days, name in zip(days_to_filter_by, day_names):
                start = datetime.datetime.now() - datetime.timedelta(days=days)
                leaders = filtered_playlist.filter(Game.match_date > start)[:10]
                leaders_dict = []
                for leader in leaders:
                    player = session.query(Player).filter(Player.platformid == leader[0]).first()
                    leaders_dict.append({
                        'name': player.platformname if player.platformname != "" else leader[0],
                        'id': leader[0],
                        'count': leader[1],
                        'avatar': player.avatar
                    })
                result[playlist][name] = leaders_dict
        return result

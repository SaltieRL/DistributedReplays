from flask import current_app
from sqlalchemy import distinct, and_, func

from backend.blueprints.spa_api.errors.errors import ReplayNotFound
from backend.blueprints.spa_api.service_layers.replay.replay import Replay
from backend.database.objects import Game, PlayerGame
from backend.database.wrapper import stat_wrapper, player_wrapper

wrapper = stat_wrapper.PlayerStatWrapper(player_wrapper.PlayerWrapper(limit=10))
avg_list, field_list, std_list = wrapper.get_stats_query()


class Group:
    def __init__(self, ids: list):
        self.ids = ids

    @classmethod
    def create_from_ids(cls, ids):
        return cls(ids)

    def _create_stats(self, session, query_filter=None):
        if query_filter is not None:
            query_filter = and_(query_filter, PlayerGame.game.in_(self.ids))
        average = session.query(*avg_list).filter(query_filter).first()
        std_devs = session.query(*std_list).filter(query_filter).first()
        average = {n.field_name: float(s) for n, s in zip(field_list, average) if s is not None}
        std_devs = {n.field_name: float(s) for n, s in zip(field_list, std_devs) if s is not None}
        return {'average': average, 'std_dev': std_devs}

    def get_stats(self):
        session = current_app.config['db']()
        return_obj = {}
        # Players
        player_tuples = session.query(PlayerGame.player, func.count(PlayerGame.player)).filter(
            PlayerGame.game.in_(self.ids)).group_by(PlayerGame.player).all()
        return_obj['playerStats'] = {}
        ensemble = []
        for player_tuple in player_tuples:
            player, count = player_tuple
            if count > 1:
                player_stats = self._create_stats(session, PlayerGame.player == player)
                return_obj['playerStats'][player] = player_stats
            else:
                ensemble.append(player)
        ensemble_stats = self._create_stats(session, PlayerGame.player.in_(ensemble))
        return_obj['ensembleStats'] = ensemble_stats

        # STATS
        # Global
        global_stats = self._create_stats(session)
        return_obj['globalStats'] = global_stats
        session.close()
        return return_obj

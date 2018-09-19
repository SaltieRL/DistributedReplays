from flask import current_app

from backend.database.wrapper import stat_wrapper, player_wrapper

wrapper = stat_wrapper.PlayerStatWrapper(player_wrapper.PlayerWrapper(limit=10))
avg_list, field_list, std_list = wrapper.get_stats_query()


class Group:
    def __init__(self, ids: list):
        self.ids = ids

    @classmethod
    def create_from_ids(cls, ids):
        return cls(ids)

    def get_stats(self):
        session = current_app.config['db']()
        stats = wrapper.get_group_stats(session, self.ids)
        session.close()
        return stats

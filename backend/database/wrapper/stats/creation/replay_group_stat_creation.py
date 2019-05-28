from backend.database.wrapper.stats.creation.shared_stat_creation import SharedStatCreation

class ReplayGroupStatCreation(SharedStatCreation):
    def __init__(self):
        super().__init__()
        self.grouped_stat_total = [
            'aerial_efficiency',
            'assists',
            'average_hit_distance',
            'average_speed',
            'boost_ratio',
            'collection_boost_efficiency',
            'goals',
            'saves',
            'score',
            'shots',
            'shot_%',
            'total_boost_efficiency',
            'turnover_efficiency',
            'used_boost_efficiency',
            'useful/hits'
        ]
        self.grouped_stat_per_game = [
            'assists',
            'goals',
            'saves',
            'score',
            'shots'
        ]
        self.grouped_stat_per_minute = [
            'boost_usage',
            'num_large_boosts',
            'num_small_boosts',
            'wasted_collection',
            'wasted_usage'
        ]
        for stat_per_game in self.grouped_stat_per_game:
            assert stat_per_game not in self.grouped_stat_per_minute

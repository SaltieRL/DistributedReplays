from backend.database.wrapper.stats.shared_stats_wrapper import SharedStatsWrapper

if __name__ == "__main__":
    stats = SharedStatsWrapper.create_stats_field_list()
    print(stats)

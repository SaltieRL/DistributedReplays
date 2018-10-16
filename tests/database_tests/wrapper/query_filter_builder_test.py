from backend.database.wrapper.query_filter_builder import QueryFilterBuilder

if __name__ == "__main__":
    query = QueryFilterBuilder().with_relative_start_time(days_ago=10).sticky().clean()
    print(query)

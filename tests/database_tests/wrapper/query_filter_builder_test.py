import unittest

from backend.database.wrapper.query_filter_builder import QueryFilterBuilder


class QueryTest(unittest.TestCase):
    def test_query_builder(self):
        query = QueryFilterBuilder().with_relative_start_time(days_ago=10).sticky().clean()
        print(query)

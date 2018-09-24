import datetime

from backend.database.objects import Game, PlayerGame


class QueryFilterBuilder:
    """
    Builds the filtered query for players or games.
    """

    def __init__(self):
        self.start_time = None
        self.end_time = None
        self.players = None
        self.tags = None  # TODO: Add tags
        self.stats_query = None
        self.rank = None
        self.initial_query = None  # This is a query that is created with initial values
        self.team_size = None
        self.replay_id = None
        self.is_game = False
        self.has_joined_game = False  # used to see if this query has been joined with the Game database

    def clear(self):
        self.start_time = None
        self.end_time = None
        self.players = None
        self.tags = None
        self.stats_query = None
        self.rank = None
        self.initial_query = None  # This is a query that is created with initial values
        self.team_size = None
        self.replay_id = None
        self.is_game = False
        self.has_joined_game = False  # used to see if this query has been joined with the Game database

    def with_relative_timeframe(self, days_ago, hours_ago):
        ago = datetime.datetime.now() - datetime.timedelta(days=days_ago, hours=hours_ago)
        return self.with_timeframe(start_time=ago)

    def with_timeframe(self, start_time=None, end_time=None):
        self.start_time = start_time
        self.end_time = end_time
        return self

    def with_players(self, player_ids):
        self.players = player_ids

    def with_tags(self, tags):
        self.tags = tags

    def with_stat_group(self, stats_query):
        self.stats_query = stats_query

    def with_rank(self, rank):
        self.rank = rank

    def with_replay_ids(self, replay_ids):
        self.replay_ids = replay_ids

    def as_game(self):
        self.is_game = True

    def build_query(self, session):
        """
        Builds a query given the current state, returns the result.
        This method does not modify state of this object at all
        :return: A filtered query.
        """
        if self.initial_query is None:
            filtered_query = session.query(*self.stats_query)
        else:
            filtered_query = self.initial_query

        if (not self.has_joined_game) and (self.start_time is not None or
                                           self.end_time is not None or
                                           self.team_size is not None):
            filtered_query = filtered_query.join(Game)
            self.has_joined_game = True

        if self.start_time is not None:
            filtered_query = filtered_query.filter(
                Game.match_date >= self.start_time)

        if self.end_time is not None:
            filtered_query = filtered_query.filter(
                Game.match_date <= self.end_time)

        if self.rank is not None:
            filtered_query = filtered_query.filter(PlayerGame.rank == self.rank)

        if self.team_size is not None:
            filtered_query = filtered_query.filter(Game.teamsize == self.team_size)

        if self.players is not None and len(self.players) > 0:
            filtered_query = filtered_query.filter(self.handle_list(PlayerGame.player, self.players))

        if self.replay_ids is not None and len(self.replay_ids) > 0:
            if self.is_game or self.has_joined_game:
                filtered_query = filtered_query.filter(self.handle_list(Game.hash, self.replay_ids))
            else:
                filtered_query = filtered_query.filter(self.handle_list(PlayerGame.game, self.replay_ids))

        # Todo: implement tags remember to handle table joins correctly

        return filtered_query

    def create_stored_query(self, session):
        """
        Creates a query then stores it locally in this object.
        Useful if we want lots of different queries built off of a central object.
        This also clears anything currently stored in the object.
        """
        query = self.build_query(session)

        # maintain state
        has_joined = self.has_joined_game
        is_game = self.is_game
        self.clear()
        self.has_joined_game = has_joined
        self.is_game = is_game

        # reassign query
        self.initial_query = query

    def handle_list(self, field, list):
        if len(self.players) == 1:
            return field == list[0]
        else:
            return field.in_(list)

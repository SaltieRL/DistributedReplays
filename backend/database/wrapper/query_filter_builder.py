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
        self.sticky_values = dict()  # a list of values that survive a clean

    def reset(self):
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
        self.sticky_values = dict()

    def clean(self):
        """
        Clears the filter but maintains the initial query and other stateful values that are required.
        """
        query = self.initial_query
        has_joined = self.has_joined_game
        is_game = self.is_game
        sticky_values = self.sticky_values
        self.reset()
        self.has_joined_game = has_joined
        self.is_game = is_game
        self.sticky_values = sticky_values
        self.initial_query = query

        for key, value in self.sticky_values.items():
            setattr(self, key, value)

        return self

    def with_relative_start_time(self, days_ago=0, hours_ago=0)-> QueryFilterBuilder:
        ago = datetime.datetime.now() - datetime.timedelta(days=days_ago, hours=hours_ago)
        return self.with_timeframe(start_time=ago)

    def with_timeframe(self, start_time=None, end_time=None)-> QueryFilterBuilder:
        self.start_time = start_time
        self.end_time = end_time
        return self

    def with_players(self, player_ids)-> QueryFilterBuilder:
        self.players = player_ids
        return self

    def with_tags(self, tags)-> QueryFilterBuilder:
        self.tags = tags
        return self

    def with_stat_query(self, stats_query)-> QueryFilterBuilder:
        self.stats_query = stats_query
        return self

    def with_rank(self, rank)-> QueryFilterBuilder:
        self.rank = rank
        return self

    def with_replay_ids(self, replay_ids)-> QueryFilterBuilder:
        self.replay_ids = replay_ids
        return self

    def as_game(self)-> QueryFilterBuilder:
        self.is_game = True
        return self

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

    def create_stored_query(self, session)-> QueryFilterBuilder:
        """
        Creates a query then stores it locally in this object.
        Useful if we want lots of different queries built off of a central object.
        This also clears anything currently stored in the object.
        """
        query = self.build_query(session)

        # maintain state
        has_joined = self.has_joined_game
        is_game = self.is_game
        self.reset()
        self.has_joined_game = has_joined
        self.is_game = is_game

        # reassign query
        self.initial_query = query
        return self

    def sticky(self)-> QueryFilterBuilder:
        """Creates a list of values that should be saved from a clean"""
        set_values = vars(self)
        self.sticky_values = dict()
        for key, value in vars(self).items():
            if value is not None and key != "sticky_values":
                self.sticky_values[key] = value

        return self

    def handle_list(self, field, list):
        if len(self.players) == 1:
            return field == list[0]
        else:
            return field.in_(list)

    def get_stored_query(self):
        return self.initial_query

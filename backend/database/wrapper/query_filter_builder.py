import datetime
from typing import List

from flask import g
from sqlalchemy import cast, String, or_
from sqlalchemy.dialects import postgresql

from backend.database.objects import Game, PlayerGame, GameVisibilitySetting


class QueryFilterBuilder:
    """
    Builds the filtered query for players or games.
    """

    def __init__(self):
        self.start_time: datetime.datetime = None
        self.end_time: datetime.datetime = None
        self.players: List[str] = None
        self.contains_all_players: List[str] = None
        self.tags = None  # TODO: Add tags
        self.stats_query = None
        self.rank: int = None
        self.initial_query = None  # This is a query that is created with initial values
        self.team_size: int = None
        self.replay_ids: List[str] = None
        self.is_game: bool = False
        self.playlists: List[int] = None
        self.has_joined_game: bool = False  # used to see if this query has been joined with the Game database
        self.safe_checking: bool = False
        self.sticky_values: dict = dict()  # a list of values that survive a clean

    def reset(self):
        self.start_time = None
        self.end_time = None
        self.players = None
        self.contains_all_players = None
        self.tags = None
        self.stats_query = None
        self.rank = None
        self.initial_query = None  # This is a query that is created with initial values
        self.team_size = None
        self.replay_ids = None
        self.is_game = False
        self.playlists = None
        self.has_joined_game = False  # used to see if this query has been joined with the Game database
        self.safe_checking = False  # checks to make sure the replay has good data for the player
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

    def with_relative_start_time(self, days_ago: float = 0, hours_ago: float = 0) -> 'QueryFilterBuilder':
        ago = datetime.datetime.now() - datetime.timedelta(days=days_ago, hours=hours_ago)
        return self.with_timeframe(start_time=ago)

    def with_timeframe(self,
                       start_time: datetime.datetime = None,
                       end_time: datetime.datetime = None) -> 'QueryFilterBuilder':
        self.start_time = start_time
        self.end_time = end_time
        return self

    def with_players(self, player_ids: List[str]) -> 'QueryFilterBuilder':
        self.players = player_ids
        return self

    def with_all_players(self, player_ids: List[str]) -> 'QueryFilterBuilder':
        self.contains_all_players = player_ids
        return self

    def with_tags(self, tags) -> 'QueryFilterBuilder':
        self.tags = tags
        return self

    def with_stat_query(self, stats_query) -> 'QueryFilterBuilder':
        self.stats_query = stats_query
        return self

    def with_rank(self, rank: int) -> 'QueryFilterBuilder':
        self.rank = rank
        return self

    def with_replay_ids(self, replay_ids: List[str]) -> 'QueryFilterBuilder':
        self.replay_ids = replay_ids
        return self

    def with_team_size(self, team_size: int) -> 'QueryFilterBuilder':
        self.team_size = team_size
        return self

    def with_safe_checking(self) -> 'QueryFilterBuilder':
        self.safe_checking = True
        return self

    def as_game(self) -> 'QueryFilterBuilder':
        self.is_game = True
        return self

    def with_playlists(self, playlists: List[int]) -> 'QueryFilterBuilder':
        self.playlists = playlists
        return self

    def build_query(self, session):
        """
        Builds a query given the current state, returns the result.
        This method does not modify state of this object at all
        :return: A filtered query.
        """
        has_joined_game = False
        if self.initial_query is None:
            filtered_query = session.query(*self.stats_query)
        else:
            filtered_query = self.initial_query

        if (self.start_time is not None or
                self.end_time is not None or
                self.team_size is not None):
            if not self.is_game:
                filtered_query = filtered_query.join(Game)
            has_joined_game = True

        if self.is_game or has_joined_game:
            # Do visibility check
            if not g.admin:
                filtered_query = filtered_query.filter(or_(Game.visibility != GameVisibilitySetting.PRIVATE,
                                     Game.players.any(g.user.platformid)))

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

        if self.playlists is not None:
            filtered_query = filtered_query.filter(Game.playlist.in_(self.playlists))

        if self.safe_checking:
            filtered_query = filtered_query.filter(PlayerGame.total_hits > 0).filter(PlayerGame.time_in_game > 0)

        if self.players is not None and len(self.players) > 0:
            filtered_query = filtered_query.filter(self.handle_list(PlayerGame.player, self.players))

        if self.contains_all_players is not None and len(self.contains_all_players) > 0:
            filtered_query = filtered_query.filter(self.handle_union(Game.players, self.contains_all_players))

        if self.replay_ids is not None and len(self.replay_ids) > 0:
            if self.is_game or has_joined_game:
                filtered_query = filtered_query.filter(self.handle_list(Game.hash, self.replay_ids))
            else:
                filtered_query = filtered_query.filter(self.handle_list(PlayerGame.game, self.replay_ids))
        # Todo: implement tags remember to handle table joins correctly

        return filtered_query

    def create_stored_query(self, session) -> 'QueryFilterBuilder':
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

    def sticky(self) -> 'QueryFilterBuilder':
        """Creates a list of values that should be saved from a clean"""
        self.sticky_values = dict()
        for key, value in vars(self).items():
            if value is not None and key != "sticky_values":
                self.sticky_values[key] = value

        return self

    def clone(self) -> 'QueryFilterBuilder':
        """Returns a copy of this object"""
        copy = QueryFilterBuilder()
        copy.initial_query = self.initial_query
        copy.has_joined_game = self.has_joined_game
        copy.is_game = self.is_game
        copy.sticky_values = self.sticky_values.copy()
        return copy

    @staticmethod
    def handle_list(field, lst):
        if isinstance(lst, list):
            if len(lst) == 1:
                return field == lst[0]
            else:
                return field.in_(lst)
        else:
            return field == lst

    @staticmethod
    def handle_union(field, lst):
        if isinstance(lst, list):
            return field.contains(cast(lst, postgresql.ARRAY(String)))
        else:
            return field.contains(cast([lst], postgresql.ARRAY(String)))

    def get_stored_query(self):
        return self.initial_query

    @staticmethod
    def apply_arguments_to_query(builder, args):
        if 'rank' in args:
            builder.with_rank(args['rank'])
        if 'team_size' in args:
            builder.with_team_size(args['team_size'])
        if 'playlists' in args:
            builder.with_playlists(args['playlists'])
        if 'date_before' in args:
            if 'date_after' in args:
                builder.with_timeframe(end_time=args['date_before'],
                                       start_time=args['date_after'])
            else:
                builder.with_timeframe(end_time=args['date_before'])
        elif 'date_after' in args:
            builder.with_timeframe(start_time=args['date_after'])
        if 'player_ids' in args:
            builder.with_all_players(args['player_ids'])

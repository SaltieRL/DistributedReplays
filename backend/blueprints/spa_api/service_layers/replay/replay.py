from typing import List, cast

from backend.blueprints.spa_api.errors.errors import ReplayNotFound, Redirect
from backend.blueprints.spa_api.service_layers.replay.json_tag import JsonTag
from backend.blueprints.spa_api.service_layers.replay.replay_player import ReplayPlayer
from backend.blueprints.spa_api.service_layers.utils import sort_player_games_by_team_then_id, with_session
from backend.data.constants.playlist import get_playlist
from backend.database.objects import Game, PlayerGame, GameVisibilitySetting, Player
from backend.database.startup import get_es
from backend.utils.safe_flask_globals import get_current_user_id


class GameScore:
    def __init__(self, team_0_score: int, team_1_score: int):
        self.team0Score = team_0_score
        self.team1Score = team_1_score

    @staticmethod
    def create_from_game(game: Game):
        return GameScore(game.team0score, game.team1score)

    @staticmethod
    def create_from_es(game: dict):
        return GameScore(game['team0score'], game['team1score'])


class Replay:
    def __init__(self, id_: str, name: str, date: str, map: str,
                 game_mode: str, game_score: GameScore,
                 players: List[ReplayPlayer], tags: List[JsonTag], visibility: GameVisibilitySetting,
                 ranks: List[int], mmrs: List[int], group_map=None, es=False, **kwargs):
        if group_map is None:
            group_map = {}
        self.id = id_
        self.name = name
        self.date = date
        self.map = map
        self.gameMode = game_mode
        self.gameScore = game_score.__dict__
        if es:
            self.players = players
        else:
            self.players = [player.__dict__ for player in players]
        self.tags = [tag.to_JSON() for tag in tags]
        if es:
            self.visibility = visibility
        else:
            self.visibility = visibility.value
        self.ranks = ranks
        self.mmrs = mmrs
        self.groupMap = group_map

    @staticmethod
    @with_session
    def create_from_id(id_: str, session=None) -> 'Replay':
        game = session.query(Game).filter(Game.hash == id_).first()
        if game is None:
            game = session.query(Game).filter(Game.replay_id == id_).first()
            if game is None:
                raise ReplayNotFound()
            raise Redirect("/replays/" + game.hash)
        replay = Replay.create_from_game(game, session=session, groups=True)
        return replay

    @staticmethod
    def create_from_game(game: Game, full=True, groups=False, session=None) -> 'Replay':
        group_map = None
        if groups and session is not None:
            players = session.query(Player).filter(Player.platformid.in_(game.players)).all()
            group_map = {player.platformid: player.groups for player in players}
        return Replay(
            id_=game.hash,
            name=game.name,
            date=game.match_date.isoformat(),
            map=game.map,
            game_mode=get_playlist(game.playlist, game.teamsize),
            game_score=GameScore.create_from_game(game),
            players=[
                ReplayPlayer.create_from_player_game(player_game, full=full)
                for player_game in sort_player_games_by_team_then_id(
                    cast(List[PlayerGame], game.playergames))
            ],
            tags=[
                JsonTag.create_from_dbtag(tag)
                for tag in game.tags if tag.owner == get_current_user_id()
            ],
            visibility=game.visibility,
            ranks=game.ranks,
            mmrs=game.mmrs,
            group_map=group_map
        )

    @staticmethod
    def create_from_es(es: dict, groups=False, session=None):
        es_ = get_es()
        game_mode = get_playlist(es['playlist'], es['teamsize'])
        players = es['players']
        del es['players']
        group_map = None
        if groups and session is not None:
            players = session.query(Player).filter(Player.platformid.in_(es['players'])).all()
            group_map = {player.platformid: player.groups for player in players}
        return Replay(
            **es,
            id_=es['hash'],
            game_mode=game_mode,
            date=es['match_date'],
            game_score=GameScore.create_from_es(es),
            players=[ReplayPlayer.create_from_es(es) for pg in es_.search()],
            tags=[

            ],
            group_map=group_map,
            es=True
        )

class CompactReplay:
    def __init__(self, id_: str, date: str, game_mode: str, game_score: GameScore):
        self.id = id_
        self.date = date
        self.gameMode = game_mode
        self.gameScore = game_score.__dict__

    @staticmethod
    @with_session
    def create_from_id(id_: str, session=None) -> 'Replay':
        game = session.query(Game).filter(Game.hash == id_).first()
        if game is None:
            game = session.query(Game).filter(Game.replay_id == id_).first()
            if game is None:
                raise ReplayNotFound()
            raise Redirect("/replays/" + game.hash)
        replay = Replay.create_from_game(game)
        return replay

    @staticmethod
    def create_from_game(game: Game) -> 'CompactReplay':
        return CompactReplay(
            id_=game.hash,
            date=game.match_date.isoformat(),
            game_mode=get_playlist(game.playlist, game.teamsize),
            game_score=GameScore.create_from_game(game)
        )

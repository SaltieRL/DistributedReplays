import flask
from sqlalchemy import func, Numeric, cast

from backend.blueprints.spa_api.service_layers.global_stats import GlobalStatsMetadata, GlobalStatsGraph, \
    GlobalStatsGraphDataset
from backend.database.objects import Game, PlayerGame
from backend.database.startup import lazy_get_redis

global_stats_metadatas = [
    GlobalStatsMetadata('Score', 'score'),
    GlobalStatsMetadata('Goals', 'goals'),
    GlobalStatsMetadata('Assists', 'assists'),
    GlobalStatsMetadata('Saves', 'saves'),
    GlobalStatsMetadata('Shots', 'shots'),
    GlobalStatsMetadata('Hits', 'total_hits'),
    GlobalStatsMetadata('Turnovers', 'turnovers'),
    GlobalStatsMetadata('Passes', 'total_passes'),
    GlobalStatsMetadata('Dribbles', 'total_dribbles'),
    GlobalStatsMetadata('Assists per Hit', 'assistsph'),
    GlobalStatsMetadata('Shots per Hit', 'shotsph'),
    GlobalStatsMetadata('Turnovers per Hit', 'turnoversph'),
    GlobalStatsMetadata('Saves per Hit', 'savesph'),
    GlobalStatsMetadata('Dribbles per Hit', 'total_dribblesph')
]


stats = ['score', 'goals', 'assists', 'saves', 'shots', 'total_hits', 'turnovers', 'total_passes', 'total_dribbles',
         'assistsph',
         'savesph', 'shotsph', 'turnoversph', 'total_dribblesph']


def better_json_dumps(response: object):
    """
    Improvement on flask.jsonify (that depends on flask.jsonify) that calls the .__dict__ method on objects
    and also handles lists of such objects.
    :param response: The object/list of objects to be jsonified.
    :return: The return value of jsonify.
    """
    try:
        return flask.json.dumps(response)
    except TypeError:
        if isinstance(response, list):
            return flask.json.dumps([value.__dict__ for value in response])
        else:
            return flask.json.dumps(response.__dict__)


def calculate_global_stats_by_playlist(session):
    overall_data = []
    numbers = []
    game_modes = range(1, 5)

    for game_mode in game_modes:
        numbers.append(
            session.query(func.count(PlayerGame.id)).join(Game, Game.hash == PlayerGame.game).filter(Game.teamsize == (game_mode)).scalar())

    for global_stats_metadata in global_stats_metadatas:
        stats_field = global_stats_metadata.field
        per_hit_name_suffix = 'ph'
        if stats_field.endswith(per_hit_name_suffix):
            _query = session.query(
                func.round(
                    cast(getattr(PlayerGame, stats_field.replace(per_hit_name_suffix, '')),
                         Numeric) / PlayerGame.total_hits, 2).label('n'),
                func.count(PlayerGame.id)).filter(PlayerGame.total_hits > 0).group_by('n').order_by('n')
        else:
            _query = session.query(getattr(PlayerGame, stats_field), func.count(PlayerGame.id)).group_by(
                getattr(PlayerGame, stats_field)).order_by(getattr(PlayerGame, stats_field))

        datasets = []
        if stats_field == 'score':
            _query = _query.filter(PlayerGame.score % 10 == 0)
        for i, game_mode in enumerate(game_modes):
            # print(g)
            data_query = _query.join(Game, Game.hash == PlayerGame.game).filter(Game.teamsize == game_mode).all()
            datasets.append({
                'name': f"{game_mode}'s",
                'keys': [],
                'values': []
            })
            for k, v in data_query:
                if k is not None:
                    datasets[-1]['keys'].append(float(k))
                    datasets[-1]['values'].append(float(v) / float(numbers[i]))
        overall_data.append(GlobalStatsGraph(
            name=global_stats_metadata.name,
            datasets=[GlobalStatsGraphDataset(**dataset) for dataset in datasets]
        ))
    session.close()
    if lazy_get_redis() is not None:
        lazy_get_redis().set('global_stats_by_playlist', better_json_dumps(overall_data))
    return overall_data

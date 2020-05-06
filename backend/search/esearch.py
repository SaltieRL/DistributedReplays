from elasticsearch import Elasticsearch

from backend.blueprints.spa_api.service_layers.replay.match_history import MatchHistory

es = Elasticsearch()

print(es.search({
    "sort": [
        {"match_date": {"order": "desc"}}
    ],
    "query": {
        "terms": {
            "playlist": [11, 13]
        }
    }
}, size=10))


def create_with_filters(page: int, limit: int, session=None, **kwargs) -> 'MatchHistory':
    # tags = JsonTag.get_tags_from_query_params(**kwargs, session=session)
    print(kwargs)
    results = es.search({
        "sort": [
            {"match_date": {"order": "desc"}}
        ],
        "query": {
            "bool": {
                "must": [{
                    "terms": {
                        k: [v] if not isinstance(v, list) else v
                    }} for k, v in kwargs.items()
                ]

            }

        }
    }, from_=page * limit, size=limit)
    #
    # builder = QueryFilterBuilder().as_game()
    #
    # if len(tags) > 0:
    #     builder.with_tags([tag.id for tag in tags])
    #
    # QueryFilterBuilder.apply_arguments_to_query(builder, kwargs)
    # query = builder.build_query(session)

    # matches = MatchHistory(results['hits']['total']['value'], [Replay.create_from_game(game) for game in results])
    return results['hits']

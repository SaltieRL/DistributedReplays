from backend.blueprints.spa_api.service_layers.replay.match_history import MatchHistory
id_ = "76561198055442516"
match_history = MatchHistory.create_from_id(id_, 0, 25)

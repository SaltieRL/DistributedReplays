import numpy as np
from backend.utils.file_manager import FileManager

FULL_BOOST_POSITIONS = np.array([
    (3000, -4100),
    (3000, 0),
    (3000, 4100),
    (-3000, -4100),
    (-3000, 0),
    (-3000, 4100),
])


class Visualizations:

    @staticmethod
    def create_from_id(id_: str) -> 'ReplayHeatmaps':
        df = FileManager.get_pandas(id_)
        protobuf_game = FileManager.get_proto(id_)

        id_to_name_map = {p.id.id: p.name for p in protobuf_game.players}
        if protobuf_game.teams[0].is_orange:
            orange_team = protobuf_game.teams[0]
        else:
            orange_team = protobuf_game.teams[1]
        orange = [id_to_name_map[pl.id] for pl in orange_team.player_ids]
        counts = [[] for a in range(FULL_BOOST_POSITIONS.shape[0])]
        players = list(df.columns.levels[0])
        players.remove("ball")
        players.remove("game")

        for player in players:
            player_df = df[player]
            boost_pickup_frames = player_df[(~(player_df.boost_collect.isnull())) & player_df.boost_collect != False]

            try:
                big_boost_pickup_frames = boost_pickup_frames[boost_pickup_frames.boost_collect > 34].index.values
            except:
                big_boost_pickup_frames = boost_pickup_frames.index.values

            for frame in big_boost_pickup_frames:
                try:
                    position = player_df.iloc[frame].loc[['pos_x', 'pos_y']]
                except:
                    continue
                distances_from_boosts = np.sqrt(
                    np.square(FULL_BOOST_POSITIONS - position.values).sum(axis=1, dtype=np.float32))
                idx: int = np.argmin(distances_from_boosts)
                counts[idx].append(BoostPickup(player, int(player in orange), int(frame)).__dict__)
        return counts


class BoostPickup:
    def __init__(self, playerName: str, playerTeam: int, frame: int):
        self.playerName = playerName
        self.playerTeam = playerTeam
        self.frame = frame

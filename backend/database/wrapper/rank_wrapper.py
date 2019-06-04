from backend.database.objects import Playlist

# Used to map playlists to a certain ranked playlist
# In case of unranked playlists, this is where you would map them to their ranked counterparts
# This is used to compare people in unranked playlists to each other
# To use a playlist as its own rank, use `None`.
rank_mapping = {
    Playlist.UNRANKED_DUELS: Playlist.RANKED_DUELS,
    Playlist.UNRANKED_DOUBLES: Playlist.RANKED_DOUBLES,
    Playlist.UNRANKED_STANDARD: Playlist.RANKED_STANDARD,
    Playlist.UNRANKED_CHAOS: Playlist.RANKED_STANDARD,

    # Ranked
    Playlist.RANKED_DUELS: None,
    Playlist.RANKED_DOUBLES: None,
    Playlist.RANKED_SOLO_STANDARD: None,
    Playlist.RANKED_STANDARD: None,

    # Ranked Other modes
    Playlist.RANKED_HOOPS: None,
    Playlist.RANKED_RUMBLE: None,
    Playlist.RANKED_DROPSHOT: None,
    Playlist.RANKED_SNOW_DAY: None
}
real_rank_mapping = {}
for k, v in rank_mapping.items():
    if v is not None:
        real_rank_mapping[k.value] = v.value
    else:
        real_rank_mapping[k.value] = k.value


def get_rank_tier(rank, playlist=13):
    if rank is not None:
        try:
            corresponding_rank = real_rank_mapping[int(playlist)]
            return rank[str(corresponding_rank)]['tier']
        except KeyError:
            return rank[str(13)]['tier']
    else:
        return 0


def get_rank_obj_by_mapping(rank, playlist=13):
    try:
        return rank[str(real_rank_mapping[int(playlist)])]
    except KeyError:
        return rank['13']

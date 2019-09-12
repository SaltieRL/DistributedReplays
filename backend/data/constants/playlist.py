playlists = {
    1: 'Duels (U)',
    2: 'Doubles (U)',
    3: 'Standard (U)',
    4: 'Chaos (U)',
    6: 'Custom',
    8: 'Offline',
    10: 'Duels',
    11: 'Doubles',
    12: 'Solo Standard',
    13: 'Standard',
    15: 'Snow Day (U)',
    16: 'Rocket Labs',
    17: 'Hoops (U)',
    18: 'Rumble (U)',
    23: 'Dropshot (U)',
    25: 'Anniversary',
    27: 'Hoops',
    28: 'Rumble',
    29: 'Dropshot',
    30: 'Snow Day'
}


def get_playlist(playlist_id: int, teamsize: int) -> str:
    if playlist_id in playlists:
        return playlists[playlist_id]
    return f"Unknown playlist: {teamsize}'s"

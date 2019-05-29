interface Leader {
    name: string
    id_: number
    count: number
    avatar: string
}

interface PlaylistLeaderboard {
    playlist: int
    leaders: Leader[]
}

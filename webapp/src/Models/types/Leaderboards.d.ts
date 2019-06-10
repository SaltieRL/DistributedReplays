interface Leader {
    name: string
    id_: string
    count: number
    avatar: string
}

interface DurationLeaders {
    month: Leader[]
    week: Leader[]
}

interface PlaylistLeaderboard {
    playlist: int
    leaders: DurationLeaders
}

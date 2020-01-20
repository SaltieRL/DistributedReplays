import {Replay} from "./Replay"

export interface GroupResponse {
    ancestors: Entry[]
    children: Entry[]
    entry: Entry
}

export interface Entry {
    game: null | string
    gameObject: null | Replay
    name: string
    owner: Player
    parent: null | string
    type: number
    uuid: string
    descendantCount: number
}

type Stats = Record<string, number>
type AllNamedStats = Record<string, Stats> // i.e. (Total), (per Game)

export interface GroupPlayerStatsResponse {
    playerStats: AllGroupPlayerStats[]
}
export interface AllGroupPlayerStats {
    name: string
    player: string
    stats: AllNamedStats
}
export interface GroupPlayerStats extends AllGroupPlayerStats {
    stats: Stats
}

// TEAMS

export interface GroupTeamStatsResponse {
    teamStats: TeamStat[]
}
export interface AllTeamStats {
    games: string[]
    names: string[]
    stats: AllNamedStats
    team: string[]
}
export interface TeamStats extends AllTeamStats {
    stats: Stats
}
export interface UUIDResponse {
    uuid: string
}

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

export interface GroupPlayerStatsResponse {
    playerStats: PlayerStat[]
}
export interface GroupPlayerStats {
    playerStats: GroupPlayerStat[]
}

export interface GroupPlayerStat {
    name: string
    player: string
    stats: Record<string, number>
}

export interface PlayerStat {
    name: string
    player: string
    stats: Record<string, Record<string, number>>
}

// TEAMS

export interface GroupTeamStatsResponse {
    teamStats: TeamStat[]
}

export interface TeamStat {
    games: string[]
    names: string[]
    stats: Record<string, Record<string, number>>
    team: string[]
}
export interface GroupTeamStats {
    teamStats: GroupTeamStat[]
}

export interface TeamStat {
    games: string[]
    names: string[]
    stats: Record<string, Record<string, number>>
    team: string[]
}
export interface GroupTeamStat {
    games: string[]
    names: string[]
    stats: Record<string, number>
    team: string[]
}
export interface UUIDResponse {
    uuid: string
}

import { Replay } from "./Replay"

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
}

export interface GroupPlayerStatsResponse {
    playerStats: PlayerStat[]
}

export interface PlayerStat {
    name: string
    player: string
    stats: any
}

// TEAMS

export interface GroupTeamStatsResponse {
    teamStats: TeamStat[]
}

export interface TeamStat {
    games: string[]
    names: string[]
    stats: any
    team: string[]
}

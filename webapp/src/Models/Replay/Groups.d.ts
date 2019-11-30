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
    ensembleStats: EnsembleStats
    playerStats: PlayerStat[]
}

export interface EnsembleStats {
    stats: any
}

export interface PlayerStat {
    name: string
    player: string
    stats: any
}

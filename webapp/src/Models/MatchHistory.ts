import {Replay} from "./Replay/Replay"

export interface MatchHistoryResponse {
    totalCount: number
    replays: Replay[]
}

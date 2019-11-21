import {doGet} from "../../apiHandler/apiHandler"
import {MatchHistoryResponse, parseReplay} from "../../Models"

export const getMatchHistory = (id: string, page: number, limit: number): Promise<MatchHistoryResponse> => {
    return doGet(`/player/${id}/match_history?page=${page}&limit=${limit}`).then((data) => ({
        ...data,
        replays: data.replays.map(parseReplay)
    }))
}

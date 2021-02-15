import {doGet} from "../../apiHandler/apiHandler"
import {MatchHistoryResponse, parseReplay} from "../../Models"

export const getMatchHistory = async (id: string, page: number, limit: number): Promise<MatchHistoryResponse> => {
    const data = await doGet<MatchHistoryResponse>(`/player/${id}/match_history?page=${page}&limit=${limit}`)
    return {...data, replays: data.replays.map(parseReplay)}
}

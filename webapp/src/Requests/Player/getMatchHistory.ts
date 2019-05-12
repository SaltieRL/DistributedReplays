import { doGet } from "../../apiHandler/apiHandler"
import { MatchHistoryResponse, parseReplay } from "../../Models"
import { useMockData } from "../Config"
import { MOCK_REPLAY_1 } from "../Mock"

export const getMatchHistory = (id: string, page: number, limit: number): Promise<MatchHistoryResponse> => {
    if (useMockData) {
        return Promise.resolve({
            totalCount: 5,
            replays: [MOCK_REPLAY_1, MOCK_REPLAY_2]
        })
    }
    return doGet(`/player/${id}/match_history?page=${page}&limit=${limit}`)
        .then((data) => ({...data, replays: data.replays.map(parseReplay)}))
}

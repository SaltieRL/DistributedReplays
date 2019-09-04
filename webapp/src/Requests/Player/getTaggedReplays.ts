import { doGet } from "../../apiHandler/apiHandler"
import { MatchHistoryResponse, parseReplay } from "../../Models"

export const getTaggedMatches = (id: string, tagName: string): Promise<MatchHistoryResponse> => {
    return doGet(`/players/${id}/tag/${tagName}`)
        .then((data) => ({
            ...data,
            replays: data.replays.map(parseReplay)
        }))
}

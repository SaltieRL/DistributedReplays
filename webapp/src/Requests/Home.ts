import {doGet} from "../apiHandler/apiHandler"
import {parseReplay} from "../Models"
import {PatreonResponse, RecentReplaysResponse, StreamResponse} from "../Models/types/Homepage"

export const getTwitchStreams = (): Promise<StreamResponse> => doGet("/home/twitch")

export const getPatreonProgress = (): Promise<PatreonResponse> => doGet("/home/patreon")

export const getRecentReplays = async (): Promise<RecentReplaysResponse> => {
    const data = await doGet<RecentReplaysResponse | undefined>("/home/recent")
    if (data) {
        return {
            recent: data.recent.map(parseReplay)
        }
    }
    return {recent: []}
}

import {doGet} from "../apiHandler/apiHandler"
import {parseReplay} from "../Models"
import {PatreonResponse, RecentReplaysResponse, StreamResponse} from "../Models/types/Homepage"

export const getTwitchStreams = (): Promise<StreamResponse> => doGet("/home/twitch")

export const getPatreonProgress = (): Promise<PatreonResponse> => doGet("/home/patreon")

export const getRecentReplays = (): Promise<RecentReplaysResponse> => {
    return doGet("/home/recent").then((data) => ({
        recent: data.recent.map(parseReplay)
    }))
}

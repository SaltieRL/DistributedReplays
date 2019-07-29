import { doGet } from "../apiHandler/apiHandler"
import { PatreonResponse, RecentReplaysResponse, StreamResponse } from "../Models/types/Homepage"
import { useMockData } from "./Config"

export const getTwitchStreams = (): Promise<StreamResponse> => {
    if (useMockData) {
        return Promise.resolve({
            streams: [
                {
                    name: "Sciguymjm",
                    title: "Follow on socials",
                    viewers: 1333337,
                    thumbnail: "https://static-cdn.jtvnw.net/previews-ttv/live_user_sciguymjm-160x90.jpg",
                    game: "Rocket League"
                }
            ]
        })
    }
    return doGet("/home/twitch")
}

export const getPatreonProgress = (): Promise<PatreonResponse> => {
    return doGet("/home/patreon")
}

export const getRecentReplays = (): Promise<RecentReplaysResponse> => {
    return doGet("/home/recent")

}

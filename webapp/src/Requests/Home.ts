import { doGet } from "../apiHandler/apiHandler"
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

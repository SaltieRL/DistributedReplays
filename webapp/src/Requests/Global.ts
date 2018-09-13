import {doGet} from "../apiHandler/apiHandler"
import {useMockData} from "./Config"

export const getReplayCount = (): Promise<number> => {
    if (useMockData) {
        return Promise.resolve(1337)
    }
    return doGet("/global/replay_count")
}

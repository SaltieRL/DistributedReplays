import {doGet, doPost} from "../apiHandler/apiHandler"
import {useMockData} from "./Config"

export const getReplayCount = (): Promise<number> => {
    if (useMockData) {
        return Promise.resolve(1337)
    }
    return doGet("/global/replay_count")
}

export const uploadReplays = (replays: File[]): Promise<any> => {  // TODO: Specify any
    const formData = new FormData()
    replays.forEach((file) => {
        formData.append("replays", file)
    })

    return doPost('/replay/upload', formData)
}

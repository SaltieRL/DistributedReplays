import {doGet, doPost} from "../apiHandler/apiHandler"
import {useMockData} from "./Config"

export const getReplayCount = (): Promise<number> => {
    if (useMockData) {
        return Promise.resolve(1337)
    }
    return doGet("/global/replay_count")
}

export const getQueueLength = (): Promise<QueueLengths> => {
    return doGet("/global/queue/count")
}

export const getGlobalStats = (): Promise<GlobalStatsGraph[]> => doGet("/global/stats")

export const uploadReplays = (replays: File[]): Promise<any> => {  // TODO: Specify any
    const formData = new FormData()
    replays.forEach((file) => {
        formData.append("replays", file)
    })

    return doPost("/upload", formData)
}

export const getLoggedInUser = () : Promise<LoggedInUser> => doGet("/me")

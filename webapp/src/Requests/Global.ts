import * as qs from "qs"
import { GlobalStatsGraph, LoggedInUser } from "src/Models"
import { doGet, doPost, useMockData } from "."

// TODO: useMockData is bad code smell. Mock data should exist in the store and we should access
// it from there.
export class GlobalService {
    private static instance: GlobalService
    private constructor() {}

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new GlobalService()
        }
        return this.instance
    }

    public getReplayCount(): Promise<number> {
        if (useMockData) {
            return Promise.resolve(1337)
        }
        return doGet("/global/replay_count")
    }
export const getQueueStatuses = (): Promise<QueueStatus[]> => {
    return doGet("/global/queue/count")
}


    public getGlobalStats(): Promise<GlobalStatsGraph[]> {
        return doGet("/global/stats")
    }

    public uploadReplays(replays: File[]) {
        const formData = new FormData()
        replays.forEach((file) => {
            formData.append("replays", file)
        })

        return doPost("/upload", formData)
    }

    public getLoggedInUser(): Promise<LoggedInUser> {
        return doGet("/me")
    }
}

export const getUploadStatuses = (ids: string[]): Promise<UploadStatus[]> => {
    return doGet("/upload" +
        qs.stringify({ids},
            {arrayFormat: "repeat", addQueryPrefix: true}
        ))
}

export const getLoggedInUser = (): Promise<LoggedInUser> => doGet("/me")

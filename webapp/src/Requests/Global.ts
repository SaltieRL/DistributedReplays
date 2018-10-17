import { GlobalStatsGraph, LoggedInUser } from "src/Models"
import { doGet, doPost } from "../apiHandler/apiHandler"
import { useMockData } from "./Config"

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

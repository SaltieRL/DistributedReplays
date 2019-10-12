import moment from "moment"
import qs from "qs"
import { doGet, doPost } from "../apiHandler/apiHandler"
import { TrainingPackResponse } from "../Models/Player/TrainingPack"
import { playlists } from "../Utils/Playlists"
import { useMockData } from "./Config"

export const getReplayCount = (): Promise<number> => {
    if (useMockData) {
        return Promise.resolve(1337)
    }
    return doGet("/global/replay_count")
}

export const getQueueStatuses = (): Promise<QueueStatus[]> => {
    return doGet("/global/queue/count")
}

export const getLeaderboards = (): Promise<PlaylistLeaderboard[]> => {
    if (useMockData) {
        const leaders: Leader[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            {
                name: `Leader${i}`,
                id_: "76561198064630547",
                count: 500 - i,
                avatar: "https://media.istockphoto.com/photos/golden-retriever-puppy-looking-up-isolated-on-" +
                    "black-backround-picture-id466614709?k=6&m=466614709&s=612x612&w=0&h=AVW-" +
                    "4RuYXFPXxLBMHiqoAKnvLrMGT9g62SduH2eNHxA="
            }
        ))
        return Promise.resolve(
            playlists.map((playlist) => (
                    {
                        leaders: {
                            month: leaders,
                            week: leaders
                        },
                        playlist: playlist.value
                    }
                )
            ))
    }
    return doGet("/global/leaderboards")
}

export const getGlobalStats = (): Promise<GlobalStatsGraph[]> => doGet("/global/stats")
export const getGlobalRankGraphs = (): Promise<any> => doGet("/global/graphs")
// TODO(Sciguymjm) Type this thing.

// @return taskIds of uploaded replays
export const uploadReplays = (replays: File[]): Promise<string[]> => {
    const formData = new FormData()
    replays.forEach((file) => {
        formData.append("replays", file)
    })

    return doPost("/upload", formData)
}

export const getUploadStatuses = (ids: string[]): Promise<UploadStatus[]> => {
    return doGet("/upload" +
        qs.stringify({ids},
            {arrayFormat: "repeat", addQueryPrefix: true}
        ))
}

export const getLoggedInUser = (): Promise<LoggedInUser> => doGet("/me")

export const getTrainingPacks = (page: number, limit: number): Promise<TrainingPackResponse> => {
    return doGet(`/training/list?page=${page}&limit=${limit}`)
        .then((data: TrainingPackResponse) => {
            data.packs = data.packs.map(parseTrainingPack)
            return data
        })
}

export const parseTrainingPack = (data: any) => {
    return {
        ...data,
        date: moment(data.date)
    }
}

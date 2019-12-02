import moment from "moment"
import qs from "qs"
import {doGet, doPost} from "../apiHandler/apiHandler"
import {ItemFull, ItemListResponse, ItemUsage} from "../Models/ItemStats"
import {TrainingPackResponse} from "../Models/Player/TrainingPack"

export const getReplayCount = (): Promise<number> => doGet("/global/replay_count")

export const getQueueStatuses = (): Promise<QueueStatus[]> => doGet("/global/queue/count")

export const getLeaderboards = (): Promise<PlaylistLeaderboard[]> => doGet("/global/leaderboards")

export const getGlobalStats = (): Promise<GlobalStatsGraph[]> => doGet("/global/stats")
export const getGlobalRankGraphs = (): Promise<any> => doGet("/global/graphs")
// TODO(Sciguymjm) Type this thing.

// @return taskIds of uploaded replays
export const uploadReplays = (replays: File[], privateTagKeys?: string[]): Promise<string[]> => {
    const formData = new FormData()
    replays.forEach((file) => {
        formData.append("replays", file)
    })
    const tagParams = qs.stringify({private_tag_keys: privateTagKeys}, {arrayFormat: "repeat", addQueryPrefix: true})

    return doPost("/upload" + tagParams, formData)
}

export const getUploadStatuses = (ids: string[]): Promise<UploadStatus[]> => {
    return doGet("/upload" + qs.stringify({ids}, {arrayFormat: "repeat", addQueryPrefix: true}))
}

export const getLoggedInUser = (): Promise<LoggedInUser> => doGet("/me")

export const getTrainingPacks = (page: number, limit: number): Promise<TrainingPackResponse> => {
    return doGet(`/training/list?page=${page}&limit=${limit}`).then((data: TrainingPackResponse) => {
        data.packs = data.packs.map(parseTrainingPack)
        return data
    })
}

export const parseTrainingPack = (data: any) => ({
    ...data,
    date: moment(data.date)
})
export const getAdminLogs = (page: number, limit: number, search: string): Promise<AdminLogsResponse> => {
    return doGet(`/admin/logs?page=${page}&limit=${limit}&search=${search}`)
}
export const getItems = (page: number, limit: number, category: number): Promise<ItemListResponse> => {
    let queryString = `/items/list?page=${page}&limit=${limit}`
    if (category) {
        queryString += `&category=${category}`
    }
    return doGet(queryString)
}

export const getItemInfo = (id: number): Promise<ItemFull> => doGet(`/items/info?id=${id}`)

export const getItemGraph = (id: number): Promise<ItemUsage> => doGet(`/items/usage?id=${id}`)

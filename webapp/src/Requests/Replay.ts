import qs from "qs"
import {doGet, doRequest} from "../apiHandler/apiHandler"
import {
    BasicStat,
    GameVisibility,
    MatchHistoryResponse,
    parseReplay,
    Replay,
    ReplaysSearchQueryParams,
    stringifyReplaySearchQueryParam
} from "../Models"
import {VisibilityResponse} from "../Models/types/VisibilityResponse"
import {useMockData} from "./Config"
import {MOCK_REPLAY_1} from "./Mock"

export const getReplay = (id: string): Promise<Replay> => {
    if (useMockData) {
        return Promise.resolve(MOCK_REPLAY_1)
    }
    return doGet(`/replay/${id}`).then(parseReplay)
}

export const getReplayPlayerStats = (id: string): Promise<BasicStat[]> => {
    return doGet(`/replay/${id}/basic_player_stats`)
}

export const getReplayTeamStats = (id: string): Promise<BasicStat[]> => {
    return doGet(`/replay/${id}/basic_team_stats`)
}

// TODO: Fix Promise return type
export const getReplayViewerData = (id: string): Promise<any> => {
    return doGet(`/replay/${id}/positions`)
}

export const getReplayViewerDataRange = (id: string, frameStart: number, count: number): Promise<any> => {
    return doGet(`/replay/${id}/positions?frame_start=${frameStart}&frame_count=${count}`)
}

// TODO: Fix Promise return type
export const getReplayMetadata = (id: string): Promise<any> => {
    return doGet(`/v1/replay/${id}?key=1`)
}

export const getReplayGroupStats = (ids: string[]): Promise<BasicStat[]> => {
    return doGet(`/replay/group` + qs.stringify({ids}, {arrayFormat: "repeat", addQueryPrefix: true}))
}

export const searchReplays = (queryParams: ReplaysSearchQueryParams): Promise<MatchHistoryResponse> => {
    return doGet(`/replay` + stringifyReplaySearchQueryParam(queryParams)).then((data) => ({
        ...data,
        replays: data.replays.map(parseReplay)
    }))
}

export const getExplanations = (): Promise<any> => {
    return doGet("/stats/explanations")
}

export const getPredictedRanks = (id: string): Promise<any> => {
    return doGet(`/replay/${id}/predict`)
}

export const setVisibility = (id: string, gameVisibility: GameVisibility): Promise<VisibilityResponse> => {
    return doRequest(`/replay/${id}/visibility/${gameVisibility}`, {method: "PUT"})
}

export const getHeatmaps = (id: string, type: string = "position"): Promise<any> => {
    return doGet(`/replay/${id}/heatmaps?type=${type}`)
}

export const getBoostmap = (id: string): Promise<any> => {
    return doGet(`/replay/${id}/boostmap`)
}

export const getKickoffs = (id: string): Promise<any> => {
    // TODO Type this!
    return doGet(`/replay/${id}/kickoffs`)
}

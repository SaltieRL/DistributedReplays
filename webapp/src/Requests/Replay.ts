import * as moment from "moment"
import * as qs from "qs"
import {
    BasicStat,
    GameMode,
    MatchHistoryResponse,
    parseReplay,
    Replay,
    ReplaysSearchQueryParams, StatDescription,
    stringifyReplaySearchQueryParam
} from "src/Models"
import { doGet } from "../apiHandler/apiHandler"
import { useMockData } from "./Config"

export const getReplay = (id: string): Promise<Replay> => {
    if (useMockData) {
        return Promise.resolve({
            id: "21312512515FAB213",
            name: "Name",
            date: moment(),
            gameMode: "1's" as GameMode,
            gameScore: {team0Score: 5, team1Score: 6},
            players: [
                {
                    id: "214214124",
                    name: "[MOCK] Kaydop",
                    isOrange: false,
                    score: 210,
                    goals: 1,
                    assists: 0,
                    saves: 0,
                    shots: 1,
                    cameraSettings: {
                        distance: 260,
                        fieldOfView: 110,
                        height: 110,
                        pitch: -3,
                        stiffness: 0.699999988079071,
                        swivelSpeed: 3,
                        transitionSpeed: 1
                    },
                    loadout: {
                        car: "Road Hog"
                    }
                },
                {
                    id: "149019024",
                    name: "[MOCK] Fairy Peak!",
                    isOrange: false,
                    score: 310,
                    goals: 1,
                    assists: 1,
                    saves: 2,
                    shots: 4,
                    cameraSettings: {
                        distance: 260,
                        fieldOfView: 110,
                        height: 110,
                        pitch: -3,
                        stiffness: 0.449999988079071,
                        swivelSpeed: 5,
                        transitionSpeed: 1
                    },
                    loadout: {
                        car: "Octane"
                    }
                },
                {
                    id: "1248921984",
                    name: "[MOCK] miztik",
                    isOrange: false,
                    score: 460,
                    goals: 3,
                    assists: 2,
                    saves: 0,
                    shots: 8,
                    cameraSettings: {
                        distance: 250,
                        fieldOfView: 107,
                        height: 100,
                        pitch: -3,
                        stiffness: 0.5,
                        swivelSpeed: 9,
                        transitionSpeed: 1
                    },
                    loadout: {
                        car: "Octane"
                    }
                },
                {
                    id: "248129841",
                    name: "kuxir97",
                    isOrange: true,
                    score: 485,
                    goals: 1,
                    assists: 3,
                    saves: 3,
                    shots: 3,
                    cameraSettings: {
                        distance: 250,
                        fieldOfView: 110,
                        height: 110,
                        pitch: -4,
                        stiffness: 0.449999988079071,
                        swivelSpeed: 6,
                        transitionSpeed: 2
                    },
                    loadout: {
                        car: "Batmobile '16"
                    }
                },
                {
                    id: "8132482941",
                    name: "gReazymeister",
                    isOrange: true,
                    score: 285,
                    goals: 2,
                    assists: 1,
                    saves: 1,
                    shots: 1,
                    cameraSettings: {
                        distance: 280,
                        fieldOfView: 110,
                        height: 110,
                        pitch: -3,
                        stiffness: 0.449999988079071,
                        swivelSpeed: 5,
                        transitionSpeed: 1
                    },
                    loadout: {
                        car: "Octane"
                    }
                },
                {
                    id: "189489124",
                    name: "Markydooda",
                    isOrange: true,
                    score: 410,
                    goals: 3,
                    assists: 0,
                    saves: 1,
                    shots: 4,
                    cameraSettings: {
                        distance: 280,
                        fieldOfView: 110,
                        height: 110,
                        pitch: -3,
                        stiffness: 0.449999988079071,
                        swivelSpeed: 4,
                        transitionSpeed: 1
                    },
                    loadout: {
                        car: "Octane"
                    }
                }
            ],
            tags: []
        })
    }
    return doGet(`/replay/${id}`)
        .then(parseReplay)
}

export const getReplayPlayerStats = (id: string): Promise<BasicStat[]> => {
    return doGet(`/replay/${id}/basic_player_stats`)
}

export const getReplayTeamStats = (id: string): Promise<BasicStat[]> => {
    return doGet(`/replay/${id}/basic_team_stats`)
}

export const getReplayViewerData = (id: string): Promise<any> => {
    return doGet(`/replay/${id}/positions`)
}

export const getReplayGroupStats = (ids: string[]): Promise<BasicStat[]> => {
    return doGet(`/replay/group` +
        qs.stringify({ids},
            {arrayFormat: "repeat", addQueryPrefix: true}
        )
    )
}

export const searchReplays = (queryParams: ReplaysSearchQueryParams): Promise<MatchHistoryResponse> => {
    return doGet(`/replay` + stringifyReplaySearchQueryParam(queryParams))
        .then((data) => ({
            ...data,
            replays: data.replays.map(parseReplay)
        }))
}

export const getExplanations = (): Promise<any> => {
    return doGet("/stats/explanations")
}

export const getStatsList = (): Promise<StatDescription[]> => {
    return doGet("/stats/list")
}

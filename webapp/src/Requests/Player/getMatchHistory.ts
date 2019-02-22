import moment from "moment"
import { doGet } from "../../apiHandler/apiHandler"
import { GameMode, MatchHistoryResponse, parseReplay } from "../../Models"
import { useMockData } from "../Config"

export const getMatchHistory = (id: string, page: number, limit: number): Promise<MatchHistoryResponse> => {
    if (useMockData) {
        return Promise.resolve({
            totalCount: 5,
            replays: [
                {
                    id: "215989AB4EF314212",
                    name: "Replay1",
                    date: moment(),
                    gameMode: "1's" as GameMode,
                    gameScore: {team0Score: 1, team1Score: 2},
                    players: [
                        {
                            id: "519021",
                            name: "testplayerblue",
                            isOrange: false,
                            score: 1,
                            goals: 1,
                            assists: 0,
                            saves: 4,
                            shots: 2,
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
                        },
                        {
                            id: "31155",
                            name: "testplayerorange",
                            isOrange: true,
                            score: 1,
                            goals: 2,
                            assists: 1,
                            saves: 2,
                            shots: 6,
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
                        }
                    ],
                    tags: []
                }
            ]
        })
    }
    return doGet(`/player/${id}/match_history?page=${page}&limit=${limit}`)
        .then((data) => ({...data, replays: data.replays.map(parseReplay)}))
}

import * as moment from "moment"
import {GameMode, Replay} from "../Models/Replay/Replay"
import {useMockData} from "./Config"
import {doGet} from "../apiHandler/apiHandler"

export const getReplay = (id: string): Promise<Replay> => {
    if (useMockData) {
        return Promise.resolve({
            name: "Name",
            date: moment(),
            gameMode: "1's" as GameMode,
            gameScore: {team0Score: 5, team1Score: 6},
            players: [
                {
                    name: "[MOCK] Kaydop",
                    isOrange: false,
                    score: 210,
                    goals: 1,
                    assists: 0,
                    saves: 0,
                    shots: 1
                },
                {
                    name: "[MOCK] Fairy Peak!",
                    isOrange: false,
                    score: 310,
                    goals: 1,
                    assists: 1,
                    saves: 2,
                    shots: 4
                },
                {
                    name: "[MOCK] miztik",
                    isOrange: false,
                    score: 460,
                    goals: 3,
                    assists: 2,
                    saves: 0,
                    shots: 8
                },
                {
                    name: "kuxir97",
                    isOrange: true,
                    score: 485,
                    goals: 1,
                    assists: 3,
                    saves: 3,
                    shots: 3
                },
                {
                    name: "gReazymeister",
                    isOrange: true,
                    score: 285,
                    goals: 2,
                    assists: 1,
                    saves: 1,
                    shots: 1
                },
                {
                    name: "Markydooda",
                    isOrange: true,
                    score: 410,
                    goals: 3,
                    assists: 0,
                    saves: 1,
                    shots: 4
                }
            ]
        })
    }
    return doGet(`/replay/${id}`)
}

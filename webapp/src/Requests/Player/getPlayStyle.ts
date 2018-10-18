import * as qs from "qs"
import { doGet } from "../../apiHandler/apiHandler"
import { PlayStyleResponse } from "../../Models/Player/PlayStyle"
import { useMockData } from "../Config"

export const getPlayStyle = (id: string, rank?: number, playlist?: number): Promise<PlayStyleResponse> => {
    if (useMockData) {
        return Promise.resolve({
                showWarning: false,
                chartDatas: [{
                    title: "Aggressiveness",
                    chartDataPoints: [
                        {
                            name: "Shots",
                            value: 0.277
                        },
                        {
                            name: "Possession",
                            value: -0.117
                        },
                        {
                            name: "Hits",
                            value: -0.544
                        },
                        {
                            name: "Shots/Hit",
                            value: -0.544
                        },
                        {
                            name: "Boost usage",
                            value: 0.357
                        },
                        {
                            name: "Speed",
                            value: 0.4827
                        }
                    ]
                }]
            }
        )
    }
    const url = qs.stringify({rank, playlist}, {addQueryPrefix: true, indices: false})
    return doGet(`/player/${id}/play_style` + url)
}

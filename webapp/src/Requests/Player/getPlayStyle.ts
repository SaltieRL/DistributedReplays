import { PlayStyleResponse } from "src/Models"
import { doGet } from "../../apiHandler/apiHandler"
import { useMockData } from "../Config"

export const getPlayStyle = (id: string, rank?: number): Promise<PlayStyleResponse> => {
    if (useMockData) {
        return Promise.resolve({
            showWarning: false,
            chartDatas: [
                {
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
                }
            ]
        })
    }
    return doGet(`/player/${id}/play_style` + (rank === undefined ? "" : `?rank=${rank}`))
}

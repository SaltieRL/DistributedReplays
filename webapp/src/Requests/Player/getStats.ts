import { doGet } from "../../apiHandler/apiHandler"
import { PlayerStats } from "../../Components/Player/Overview/SideBar/PlayerStatsCard"
import { useMockData } from "../Config"

export const getStats = (id: string): Promise<PlayerStats> => {
    if (useMockData) {
        return Promise.resolve({
            car: {
                carName: "octane",
                carPercentage: 0.8
            },
            playersInCommon: [
                {
                    count: 3,
                    id: "76561198060924319",
                    name: "synthex",
                    avatar: ""
                },
                {
                    count: 2,
                    id: "76561198296700336",
                    name: "Starsy",
                    avatar: ""
                },
                {
                    count: 1,
                    id: "76561198201788086",
                    name: "Blitze",
                    avatar: ""
                }
            ]
        })
    }
    return doGet(`/player/${id}/profile_stats`)
}

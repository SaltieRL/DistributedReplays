import { doGet } from "../../apiHandler/apiHandler"
import { PlayerStats } from "../../Components/Player/Overview/SideBar/PlayerStatsCard"
import { useMockData } from "../Config"

export const getStats = (id: string): Promise<PlayerStats> => {
    if (useMockData) {
        return Promise.resolve({
            car: {
                carName: "octane",
                carPercentage: 0.8
            }
        })
    }
    return doGet(`/player/${id}/profile_stats`)
}

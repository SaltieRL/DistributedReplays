import { doGet, useMockData } from ".."
import { PlayerStats } from "../../Components/Player/Overview/SideBar/PlayerStatsCard"

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

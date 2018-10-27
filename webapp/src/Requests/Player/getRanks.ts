import { doGet } from "../../apiHandler/apiHandler"
import { PlayerRanks } from "../../Components/Player/Overview/SideBar/PlayerRanksCard"
import { useMockData } from "../Config"

export const getRanks = (id: string): Promise<PlayerRanks> => {
    if (useMockData) {
        const rating = {
            name: "Eggplant III (div 3)",
            rating: 2,
            rank: 5
        }
        return Promise.resolve({
            duel: rating,
            doubles: rating,
            solo: rating,
            standard: rating
        })
    }
    return doGet(`/player/${id}/ranks`)
}

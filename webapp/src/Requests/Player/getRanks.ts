import {doGet} from "../../apiHandler/apiHandler"
import {PlayerRanks} from "../../Components/Player/Overview/SideBar/PlayerRanksCard"

export const getRanks = (id: string): Promise<PlayerRanks> => doGet(`/player/${id}/ranks`)

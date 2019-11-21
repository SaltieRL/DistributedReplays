import {doGet} from "../../apiHandler/apiHandler"

export const getStats = (id: string): Promise<PlayerStats> => doGet(`/player/${id}/profile_stats`)

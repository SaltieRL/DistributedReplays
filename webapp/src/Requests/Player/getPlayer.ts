import {doGet} from "../../apiHandler/apiHandler"

export const getPlayer = (id: string): Promise<Player> => doGet(`/player/${id}/profile`)

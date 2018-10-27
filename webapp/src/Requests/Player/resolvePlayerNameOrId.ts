// Checks if nameOrId exists by querying backend. Resolves name to Id.
import { doGet } from "../../apiHandler/apiHandler"
import { useMockData } from "../Config"

export const resolvePlayerNameOrId = (nameOrId: string): Promise<string> => {
    if (useMockData) {
        return Promise.resolve("testUserId")
    }
    return doGet(`/player/${nameOrId}`)
}

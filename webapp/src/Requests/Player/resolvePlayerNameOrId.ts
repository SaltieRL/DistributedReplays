// Checks if nameOrId exists by querying backend. Resolves name to Id.
import {doGet} from "../../apiHandler/apiHandler"

export const resolvePlayerNameOrId = (nameOrId: string): Promise<string> => doGet(`/player/${nameOrId}`)

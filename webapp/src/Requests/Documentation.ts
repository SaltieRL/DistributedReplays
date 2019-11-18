import {doGet} from "../apiHandler/apiHandler"

export const getDocumentation = (): Promise<Tag[]> => {
    return doGet(`/documentation`)
}

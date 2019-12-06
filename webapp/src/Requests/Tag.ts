import moment from "moment"
import {doGet, doRequest} from "../apiHandler/apiHandler"

export const createTag = (name: string): Promise<Tag> => {
    return doRequest(`/tag/${name}`, {method: "PUT"})
}

export const renameTag = (currentName: string, newName: string): Promise<Tag> => {
    return doRequest(`/tag/${currentName}?new_name=${newName}`, {method: "PATCH"})
}

export const deleteTag = (name: string): Promise<void> => {
    return doRequest(`/tag/${name}`, {method: "DELETE"})
}

export const getAllTags = (): Promise<Tag[]> => {
    return doGet(`/tag`)
}

export const addTagToGame = (name: string, replayId: string): Promise<void> => {
    return doRequest(`/tag/${name}/replay/${replayId}`, {method: "PUT"})
}

export const removeTagFromGame = (name: string, replayId: string): Promise<void> => {
    return doRequest(`/tag/${name}/replay/${replayId}`, {method: "DELETE"})
}

export const generateTagPrivateID = (tag: Tag): Promise<string> => {
    const time = moment().valueOf()
    return doRequest(`/tag/${tag.name}/private_key/${time}`, {method: "PUT"})
}
export const getPrivateTagKey = (tag: Tag): Promise<string> => {
    return doGet(`/tag/${tag.name}/private_key`)
}

export const generateTagPrivateIdAndGetKey = (tag: Tag): Promise<string> => {
    return generateTagPrivateID(tag).then(() => getPrivateTagKey(tag))
}

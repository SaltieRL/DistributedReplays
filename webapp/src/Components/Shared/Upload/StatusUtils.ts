import {getUploadStatuses} from "../../../Requests/Global"

// TODO: Check if this is the right place for this and if this should be in redux.

export const getPreviousUploads = (): string[] => {
    return JSON.parse(sessionStorage.getItem("taskIds") || "[123]")
}

export const getCurrentUploadStatuses = (): Promise<UploadStatus[]> => {
    const currentTaskIds = getPreviousUploads()
    if (currentTaskIds.length === 0) {
        return Promise.resolve([])
    }
    return getUploadStatuses(currentTaskIds)
}

export const addTaskIds = (taskIds: string[]) => {
    const currentTaskIds: string[] = JSON.parse(sessionStorage.getItem("taskIds") || "[]")
    sessionStorage.setItem("taskIds", JSON.stringify([...currentTaskIds, ...taskIds]))
}

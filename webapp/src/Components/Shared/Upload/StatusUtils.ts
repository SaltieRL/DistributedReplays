import {getUploadStatuses} from "../../../Requests/Global"

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

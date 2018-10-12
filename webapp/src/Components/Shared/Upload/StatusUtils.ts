import * as moment from "moment"
import {getUploadStatuses} from "../../../Requests/Global"

const SESSION_STORAGE_UPLOADS_KEY = "uploadTasks"
// TODO: Check if this is the right place for this and if this should be in redux.

export interface UploadTask {
    id: string
    dateCreated: moment.Moment
}

const stringifyUploadTasks = (uploadTasks: UploadTask[]) => {
    return JSON.stringify(
        uploadTasks.map((uploadTask) => (
            {
                ...uploadTask,
                dateCreated: uploadTask.dateCreated.unix()
            }
        ))
    )
}

export const getPreviousUploads = (): UploadTask[] => {
    return JSON.parse(sessionStorage.getItem(SESSION_STORAGE_UPLOADS_KEY) || "[]")
        .map((jsonUploadTask: any) => ({...jsonUploadTask, dateCreated: moment.unix(jsonUploadTask.dateCreated)}))
}

export const getCurrentUploadStatuses = (): Promise<UploadStatus[]> => {
    const currentTaskIds = getPreviousUploads().map((uploadTask) => uploadTask.id)
    if (currentTaskIds.length === 0) {
        return Promise.resolve([])
    }
    return getUploadStatuses(currentTaskIds)
}

const createNewUploadTask = (taskId: string): UploadTask => (
    {
        id: taskId,
        dateCreated: moment()
    }
)

export const addTaskIds = (taskIds: string[]) => {
    const currentTasks: UploadTask[] = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_UPLOADS_KEY) || "[]")
    sessionStorage.setItem(SESSION_STORAGE_UPLOADS_KEY, stringifyUploadTasks(
        [
            ...currentTasks,
            ...taskIds.map(createNewUploadTask)
        ]
    ))
}

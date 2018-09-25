import {Reducer} from "redux"
import {NotificationsActionTypes, NotificationsState} from "./actions"

export const notificationsReducer: Reducer<NotificationsState, NotificationsActionTypes> = (
    state = [], action) => {
    switch (action.type) {
        case "SHOW_NOTIFICATION":
            return [...state, action.notification]
        case "DISMISS_NOTIFICATION":
            return state.slice(1)
        default:
            return state
    }
}

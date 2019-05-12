import { Action, handleActions } from "redux-actions"
import { NotificationProps } from "../../Components/Shared/Notification/NotificationSnackbar"
import { NotificationActions } from "./actions"

export type NotificationsState = NotificationProps[]

const initialState: NotificationsState = []

export const notificationsReducer = handleActions<NotificationsState, any>(
    {
        [NotificationActions.Type.SHOW_NOTIFICATION]: (
            state: NotificationsState,
            action: Action<NotificationProps>
        ): NotificationsState => {
            if (action.payload) {
                return [...state, action.payload]
            }
            return state
        },
        [NotificationActions.Type.DISMISS_NOTIFICATION]: (
            state: NotificationsState,
            _
        ): NotificationsState => {
            return state.slice(1)
        }
    },
    initialState
)

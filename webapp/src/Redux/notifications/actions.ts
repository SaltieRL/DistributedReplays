import {Action} from "redux"
import {NotificationProps} from "../../Components/Shared/Notification/NotificationSnackbar"

interface ShowNotifictionAction extends Action<"SHOW_NOTIFICATION"> {
    notification: NotificationProps
}

export const ShowNotifictionAction = (notification: NotificationProps): ShowNotifictionAction => ({
    notification,
    type: "SHOW_NOTIFICATION"
})

export type NotificationsActionTypes = ShowNotifictionAction

export type NotificationsState = NotificationProps[]

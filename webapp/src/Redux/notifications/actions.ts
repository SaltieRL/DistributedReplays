import {Action} from "redux"
import {NotificationProps} from "../../Components/Shared/Notification/NotificationSnackbar"

interface ShowNotifictionAction extends Action<"SHOW_NOTIFICATION"> {
    notification: NotificationProps
}

export const showNotifictionAction = (notification: NotificationProps): ShowNotifictionAction => ({
    notification,
    type: "SHOW_NOTIFICATION"
})

type DismissNotificationAction = Action<"DISMISS_NOTIFICATION">

export const dismissNotificationAction = (): DismissNotificationAction => ({
    type: "DISMISS_NOTIFICATION"
})

export type NotificationsActionTypes = ShowNotifictionAction
    | DismissNotificationAction

export type NotificationsState = NotificationProps[]

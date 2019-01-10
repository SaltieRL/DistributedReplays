import { Omit } from "lodash"
import { createAction } from "redux-actions"
import { NotificationProps } from "../../Components/Shared/Notification/NotificationSnackbar"

export namespace NotificationActions {
    export enum Type {
        SHOW_NOTIFICATION = "SHOW_NOTIFICATION",
        DISMISS_NOTIFICATION = "DISMISS_NOTIFICATION"
    }

    export const showNotifictionAction = createAction<NotificationProps>(Type.SHOW_NOTIFICATION)
    export const dismissNotificationAction = createAction(Type.DISMISS_NOTIFICATION)
}

export type NotificationActions = Omit<typeof NotificationActions, "Type">

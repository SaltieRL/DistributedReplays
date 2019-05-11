import { createAction } from "redux-actions"
import { NotificationProps } from "../../Components/Shared/Notification/NotificationSnackbar"

enum Type {
    SHOW_NOTIFICATION = "SHOW_NOTIFICATION",
    DISMISS_NOTIFICATION = "DISMISS_NOTIFICATION"
}

export const NotificationActions = {
    Type,
    showNotifictionAction: createAction<NotificationProps>(Type.SHOW_NOTIFICATION),
    dismissNotificationAction: createAction(Type.DISMISS_NOTIFICATION)
}

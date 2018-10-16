import { connect } from "react-redux"
import { Dispatch } from "redux"
import { showNotifictionAction } from "../../../Redux/notifications/actions"
import { NotificationProps } from "./NotificationSnackbar"

const mapDispatchToProps = (dispatch: Dispatch) => ({
    showNotification: (notificationProps: NotificationProps) => dispatch(showNotifictionAction(notificationProps))
})

export type WithNotifications = ReturnType<typeof mapDispatchToProps>

export const withNotifications = () =>
    connect(
        null,
        mapDispatchToProps
    )

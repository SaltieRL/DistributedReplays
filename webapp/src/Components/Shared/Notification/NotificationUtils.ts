import { connect } from "react-redux"
import { Dispatch } from "redux"
import { NotificationActions } from "../../../Redux"
import { NotificationProps } from "./NotificationSnackbar"

const mapDispatchToProps = (dispatch: Dispatch) => ({
    showNotification: (notificationProps: NotificationProps) =>
        dispatch(NotificationActions.showNotifictionAction(notificationProps))
})

export type WithNotifications = ReturnType<typeof mapDispatchToProps>

export const withNotifications = () => connect(null, mapDispatchToProps)

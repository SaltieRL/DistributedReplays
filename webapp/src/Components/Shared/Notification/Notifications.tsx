import * as React from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { NotificationActions, StoreState } from "../../../Redux"
import { NotificationProps, NotificationSnackbar } from "./NotificationSnackbar"

type Props = ReturnType<typeof mapStateToProps>
    & ReturnType<typeof mapDispatchToProps>

interface State {
    currentNotification: NotificationProps
    open: boolean
}

class NotificationsComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            open: false,
            currentNotification: {variant: "error", message: "This should not appear.", timeout: 0}
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (this.props.notifications.length > 0 && this.props.notifications !== prevProps.notifications) {
            this.setState({currentNotification: this.props.notifications[0], open: true})
        }
    }

    public render() {
        const notificationsCount = this.props.notifications.length
        return (
            <NotificationSnackbar open={this.state.open}
                                  handleClose={this.handleClose}
                                  {...this.state.currentNotification}
                                  count={notificationsCount > 1 ? notificationsCount : undefined}
            />
        )
    }

    private readonly handleClose = (event: unknown, reason?: string): void => {
        if (reason === "clickaway") {
            return
        }
        this.setState({open: false})
        this.props.dismissNotification()
    }
}

export const mapStateToProps = (state: StoreState) => ({
    notifications: state.notifications
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
    dismissNotification: () => dispatch(NotificationActions.dismissNotificationAction())
})

export const Notifications = connect(mapStateToProps, mapDispatchToProps)(NotificationsComponent)

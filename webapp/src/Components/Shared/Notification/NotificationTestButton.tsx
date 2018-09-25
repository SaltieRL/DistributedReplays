import {Button} from "@material-ui/core"
import * as React from "react"
import {connect} from "react-redux"
import {Dispatch} from "redux"
import {showNotifictionAction} from "../../../Redux/notifications/actions"
import {NotificationProps} from "./NotificationSnackbar"

type Props = ReturnType<typeof mapDispatchToProps>

interface State {
    count: number
}

class NotificationTestButtonComponent extends React.PureComponent<Props, State> {
    private readonly showNotification = () => {
        this.props.showNotification(this.createNotification())
        this.setState({count: this.state.count + 1})
    }
    private readonly createNotification = (): NotificationProps => {
        return {
            variant: "success",
            message: `Success notification ${this.state.count}`,
            timeout: 1000
        }
    }

    constructor(props: Props) {
        super(props)
        this.state = {count: 0}
    }

    public render() {
        return (
            <Button variant="outlined" onClick={this.showNotification}>
                TEST NOTIFICATION
            </Button>
        )
    }
}

export const mapDispatchToProps = (dispatch: Dispatch) => ({
    showNotification: (notificationProps: NotificationProps) => dispatch(showNotifictionAction(notificationProps))
})

export const NotificationTestButton = connect(null, mapDispatchToProps)(NotificationTestButtonComponent)

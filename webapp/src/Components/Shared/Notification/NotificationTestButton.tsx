import { Button } from "@material-ui/core"
import * as React from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { NotificationActions } from "../../../Redux"
import { NotificationProps } from "./NotificationSnackbar"

type Props = ReturnType<typeof mapDispatchToProps>

interface State {
    count: number
}

class NotificationTestButtonComponent extends React.PureComponent<Props, State> {
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
}

export const mapDispatchToProps = (dispatch: Dispatch) => ({
    showNotification: (notificationProps: NotificationProps) =>
        dispatch(NotificationActions.showNotifictionAction(notificationProps))
})

export const NotificationTestButton = connect(null, mapDispatchToProps)(NotificationTestButtonComponent)

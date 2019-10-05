import { withWidth } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import * as H from "history"
import * as React from "react"
import { doGet } from "../../apiHandler/apiHandler"
import { withNotifications, WithNotifications } from "../Shared/Notification/NotificationUtils"

interface OwnProps {
    to: H.LocationDescriptor
}

type Props = OwnProps
    & WithWidth
    & WithNotifications

interface State {
    open: boolean
    anchorElement?: HTMLElement
}

class ResultsActionsComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {open: false}
    }

    public render() {

        const linkButton = (
            <Button onClick={this.createPack}>
                Create pack
            </Button>
        )

        return (
            <div style={{paddingRight: 8}}>
                {isWidthUp("sm", this.props.width) &&
                <div style={{display: "flex"}}>
                    {linkButton}
                </div>
                }
            </div>
        )
    }

    private createPack = () => {
        doGet("/training/create")
            .then(() => {
                this.props.showNotification({
                    variant: "success",
                    message: "Successfully created! Give up to a minute for generation to complete",
                    timeout: 5000
                })
            })
    }
}

export const TrainingPackResultsActions = withWidth()(withNotifications()(ResultsActionsComponent))

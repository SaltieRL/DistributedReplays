import {Button, CircularProgress, createStyles, Typography, WithStyles, withStyles} from "@material-ui/core"
import * as React from "react"
import {AppError} from "../../Models/Error"
import {WithNotifications, withNotifications} from "./Notification/NotificationUtils"

interface OwnProps {
    load: () => Promise<any>
    reloadSignal?: boolean
}

type Props = OwnProps
    & WithStyles<typeof styles>
    & WithNotifications

interface State {
    loadingState: "not loaded" | "loading" | "loaded" | "failed"
}

export class LoadableWrapperComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {loadingState: "not loaded"}
    }

    public componentDidMount() {
        this.attemptToLoad()
    }

    public componentWillUpdate(prevProps: Readonly<Props>) {
        if (prevProps.reloadSignal !== this.props.reloadSignal) {
            this.attemptToLoad()
        }
    }

    public render() {
        const {classes} = this.props
        const {loadingState} = this.state
        return (
            <>
                {loadingState === "loading" &&
                <div className={classes.loadableWrapper}>
                    <CircularProgress/>
                </div>
                }

                {loadingState === "loaded" && this.props.children}

                {loadingState === "failed" &&
                <>
                    <div className={classes.loadableWrapper}>
                        <Typography variant="subheading">
                            Failed to load the required data.
                        </Typography>
                        <Button variant="outlined" onClick={this.attemptToLoad}>
                            Reload
                        </Button>
                    </div>

                </>
                }
            </>
        )
    }

    private readonly attemptToLoad = () => {
        this.setState({loadingState: "loading"})
        this.props.load()
            .then(() => this.setState({loadingState: "loaded"}))
            .catch((appError: AppError) => {
                this.setState({
                    loadingState: "failed"
                })
                this.props.showNotification({variant: "appError", appError})
            })
    }
}

const styles = createStyles({
    loadableWrapper: {
        margin: "auto",
        textAlign: "center",
        padding: 20
    }
})

export const LoadableWrapper = withStyles(styles)(
    withNotifications()(LoadableWrapperComponent)
)

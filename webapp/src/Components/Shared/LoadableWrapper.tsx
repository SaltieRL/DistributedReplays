import {Button, CircularProgress, createStyles, Typography, WithStyles, withStyles} from "@material-ui/core"
import * as React from "react"
import {AppError} from "../../Models/Error"
import {NotificationSnackbar} from "./Notification/NotificationSnackbar"

interface OwnProps {
    load: () => Promise<any>
    reloadSignal?: boolean
}

type Props = OwnProps
 & WithStyles<typeof styles>

interface State {
    loadingState: "not loaded" | "loading" | "loaded" | "failed"
    appError?: AppError
    notificationOpen: boolean
}

export class LoadableWrapperComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {loadingState: "not loaded", notificationOpen: false}
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
        const {loadingState, appError, notificationOpen} = this.state
        return (
            <>
                {loadingState === "loading" &&
                <div className={classes.loadableWrapper}>
                    <CircularProgress/>
                </div>
                }

                {loadingState === "loaded" && this.props.children}

                {loadingState === "failed" && appError &&
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
                {appError && <NotificationSnackbar variant="appError" appError={appError}
                                                   open={notificationOpen}
                                                   handleClose={this.handleNotificationClose}/>
                }
            </>
        )
    }

    private readonly attemptToLoad = () => {
        this.setState({loadingState: "loading", notificationOpen: false})
        this.props.load()
            .then(() => this.setState({loadingState: "loaded"}))
            .catch((appError: AppError) => this.setState({
                loadingState: "failed",
                appError,
                notificationOpen: true
            }))
    }

    private readonly handleNotificationClose = (event: any, reason?: string) => {
        if (reason === "clickaway") {
            return
        }
        this.setState({notificationOpen: false})
    }
}

const styles = createStyles({
    loadableWrapper: {
        margin: "auto",
        textAlign: "center",
        padding: 20
    }
})


export const LoadableWrapper = withStyles(styles)(LoadableWrapperComponent)

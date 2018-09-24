import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    createStyles,
    Theme,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core"
import Clear from "@material-ui/icons/Clear"
import CloudUpload from "@material-ui/icons/CloudUpload"
import * as React from "react"
import {DropFilesEventHandler} from "react-dropzone"
import {uploadReplays} from "../../../Requests/Global"
import {NotificationSnackbar} from "../Notification/NotificationSnackbar"
import {BakkesModAd} from "./BakkesModAd"
import {UploadDropzone} from "./UploadDropzone"

type Props = WithStyles<typeof styles>

interface State {
    files: File[]
    rejected: File[]
    uploadingStage?: "pressedUpload" | "uploaded"
    notificationOpen: boolean
}

class UploadFormComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {files: [], rejected: [], notificationOpen: false}
    }

    public render() {
        const {classes} = this.props
        const hasFilesSelected = this.state.files.length !== 0
        return (
            <>
                <Card>
                    <CardHeader title={"Upload Replays"}/>
                    {this.state.uploadingStage !== "pressedUpload" ?
                        <>
                            <CardContent>
                                <BakkesModAd/>
                                <UploadDropzone onDrop={this.handleDrop} files={this.state.files}/>
                                {this.state.rejected.length !== 0 &&
                                <Typography color="error">
                                    {this.state.rejected.length} file(s) were not selected as they do not end in
                                    ".replay".
                                </Typography>
                                }
                            </CardContent>
                            < CardActions>
                                < Button variant="outlined"
                                         onClick={this.clearFiles}
                                         disabled={!hasFilesSelected}
                                >
                                    <Clear className={classes.leftIcon}/>
                                    Clear
                                </Button>

                                <Button variant="contained"
                                        color="secondary"
                                        onClick={this.handleUpload}
                                        disabled={!hasFilesSelected}
                                        className={classes.uploadButton}
                                >
                                    <CloudUpload className={classes.leftIcon}/>
                                    Upload
                                </Button>
                            </CardActions>
                        </>
                        :
                        <div style={{margin: "auto", textAlign: "center", padding: 20}}>
                            <CircularProgress/>
                        </div>
                    }
                </Card>
                <NotificationSnackbar open={this.state.notificationOpen}
                                      variant="success"
                                      handleClose={this.handleNotificationClose}
                                      message="Successfully uploaded replays."
                                      timeout={5000}/>
            </>
        )
    }

    private readonly handleDrop: DropFilesEventHandler = (accepted, rejected) => {
        this.setState({
            files: accepted,
            rejected
        })
    }

    private readonly handleUpload = () => {
        this.setState({uploadingStage: "pressedUpload"})
        uploadReplays(this.state.files)
            .then(this.clearFiles)
            .then(() => this.setState({uploadingStage: "uploaded", notificationOpen: true}))
    } // TODO: Move Notification to redux.

    private readonly clearFiles = () => {
        this.setState({files: [], rejected: []})
    }

    private readonly handleNotificationClose = (event: any, reason?: string) => {
        if (reason === "clickaway") {
            return
        }
        this.setState({notificationOpen: false})
    }
}

const styles = (theme: Theme) => createStyles({
    leftIcon: {
        marginRight: theme.spacing.unit
    },
    uploadButton: {
        marginLeft: "auto"
    }
})

export const UploadForm = withStyles(styles)(UploadFormComponent)

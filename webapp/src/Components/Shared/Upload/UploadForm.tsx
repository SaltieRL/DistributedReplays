import {
    Button,
    CircularProgress,
    createStyles,
    DialogActions,
    DialogContent,
    Theme,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core"
import Clear from "@material-ui/icons/Clear"
import CloudUpload from "@material-ui/icons/CloudUpload"
import * as React from "react"
import { DropFilesEventHandler } from "react-dropzone"
import { GlobalService } from "src/Requests"
import { WithNotifications, withNotifications } from "../Notification/NotificationUtils"
import { BakkesModAd } from "./BakkesModAd"
import { addTaskIds } from "./StatusUtils"
import { UploadDropzone } from "./UploadDropzone"

type Props = WithStyles<typeof styles> & WithNotifications

interface State {
    files: File[]
    rejected: File[]
    uploadingStage?: "pressedUpload" | "uploaded"
}

class UploadFormComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { files: [], rejected: [] }
    }

    public render() {
        const { classes } = this.props
        const hasFilesSelected = this.state.files.length !== 0
        return (
            <>
                {this.state.uploadingStage !== "pressedUpload" ?
                    <>
                        <DialogContent>
                            <BakkesModAd />
                            <UploadDropzone onDrop={this.handleDrop} files={this.state.files} />
                            {this.state.rejected.length !== 0 &&
                                <Typography color="error">
                                    {this.state.rejected.length} file(s) were not selected as they do not end in
                                    ".replay".
                            </Typography>
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined"
                                onClick={this.clearFiles}
                                disabled={!hasFilesSelected}
                            >
                                <Clear className={classes.leftIcon} />
                                Clear
                            </Button>

                            <Button variant="contained"
                                color="secondary"
                                onClick={this.handleUpload}
                                disabled={!hasFilesSelected}
                                className={classes.uploadButton}
                            >
                                <CloudUpload className={classes.leftIcon} />
                                Upload
                            </Button>
                        </DialogActions>
                    </>
                    :
                    <div style={{ margin: "auto", textAlign: "center", padding: 20 }}>
                        <CircularProgress />
                    </div>
                }
            </>
        )
    }

    private readonly handleUpload = () => {
        this.setState({ uploadingStage: "pressedUpload" })
        GlobalService.getInstance()
            .uploadReplays(this.state.files)
            .then(addTaskIds)
            .then(this.clearFiles)
            .then(() => {
                this.setState({ uploadingStage: "uploaded" })
                this.props.showNotification({
                    variant: "success",
                    message: "Successfully uploaded replays",
                    timeout: 5000
                })
            })
            .catch(() =>
                this.props.showNotification({
                    variant: "error",
                    message: "Could not upload replays."
                })
            )
    }

    private readonly handleDrop: DropFilesEventHandler = (accepted, rejected) => {
        this.setState({
            files: accepted,
            rejected
        })
    }

    private readonly clearFiles = () => {
        this.setState({ files: [], rejected: [] })
    }
}

const styles = (theme: Theme) =>
    createStyles({
        leftIcon: {
            marginRight: theme.spacing.unit
        },
        uploadButton: {
            marginLeft: "auto"
        }
    })

export const UploadForm = withStyles(styles)(withNotifications()(UploadFormComponent))

import {
    Button,
    CircularProgress,
    createStyles,
    DialogActions,
    DialogContent, LinearProgress,
    Theme,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core"
import Clear from "@material-ui/icons/Clear"
import CloudUpload from "@material-ui/icons/CloudUpload"
import * as React from "react"
import { DropFilesEventHandler } from "react-dropzone"
import { uploadReplays } from "../../../Requests/Global"
import { WithNotifications, withNotifications } from "../Notification/NotificationUtils"
import { BakkesModAd } from "./BakkesModAd"
import { addTaskIds } from "./StatusUtils"
import { UploadDropzone } from "./UploadDropzone"
import { UploadTags } from "./UploadTags"

const styles = (theme: Theme) => createStyles({
    leftIcon: {
        marginRight: theme.spacing.unit
    },
    uploadButton: {
        marginLeft: "auto"
    }
})

type Props = WithStyles<typeof styles>
    & WithNotifications

interface State {
    files: File[]
    rejected: File[]
    uploadingStage?: "pressedUpload" | "uploaded"
    selectedPrivateKeys: string[]
    filesRemaining: number
}

class UploadFormComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {files: [], rejected: [], selectedPrivateKeys: [], filesRemaining: -1}
    }

    public render() {
        const {classes} = this.props
        const hasFilesSelected = this.state.files.length !== 0
        return (
            <>
                {this.state.uploadingStage !== "pressedUpload" ?
                    <>
                        <DialogContent>
                            <BakkesModAd/>
                            <UploadDropzone onDrop={this.handleDrop} files={this.state.files}/>
                            {this.state.rejected.length !== 0 &&
                            <Typography color="error">
                                {this.state.rejected.length} file(s) were not selected as they do not end in
                                ".replay".
                            </Typography>
                            }

                            <UploadTags
                                selectedPrivateKeys={this.state.selectedPrivateKeys}
                                handlePrivateKeysChange={this.handlePrivateKeysChange}/>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined"
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
                        </DialogActions>
                    </>
                    :
                    <>
                        <div style={{margin: "auto", textAlign: "center", padding: 20, flexGrow: 1}}>
                            <CircularProgress/>
                        </div>
                        <div style={{flexGrow: 1, padding: 20}}>

                            <Typography>
                                Uploading
                                 {this.state.files.length - this.state.filesRemaining} of {this.state.files.length}...
                            </Typography>
                            <LinearProgress variant="determinate"
                                            color={"secondary"}
                                            value={(1 - (this.state.filesRemaining / this.state.files.length)) * 100}
                                            style={{width: "100% !important"}}/>
                        </div>
                    </>
                }
            </>
        )
    }

    private readonly handleUpload = () => {
        this.setState({uploadingStage: "pressedUpload", filesRemaining: this.state.files.length})
        return this.uploadSingleFile(this.state.files.slice(0))
            .catch(() => this.props.showNotification({
                variant: "error",
                message: "Could not upload replays."
            }))

    }

    private readonly uploadSingleFile = (files: File[], ids: any = []): any => {
        if (files.length === 0) {
            addTaskIds(ids)
            this.clearFiles()
            this.setState({uploadingStage: "uploaded", filesRemaining: -1})
            this.props.showNotification({
                variant: "success",
                message: "Successfully uploaded replays",
                timeout: 5000
            })
            return null
        }
        const f = files.shift()
        if (f !== undefined) {
            return uploadReplays([f], this.state.selectedPrivateKeys).then((id: any) => {
                this.setState({filesRemaining: files.length})
                this.uploadSingleFile(files, ids.concat(id))
            })
        } else {
            return this.uploadSingleFile(files, ids)
        }
    }

    private readonly handleDrop: DropFilesEventHandler = (accepted, rejected) => {
        this.setState({
            files: accepted,
            rejected
        })
    }

    private readonly clearFiles = () => {
        this.setState({files: [], rejected: []})
    }

    private readonly handlePrivateKeysChange = (selectedPrivateKeys: string[]) => {
        this.setState({selectedPrivateKeys})
    }
}

export const UploadForm = withStyles(styles)(withNotifications()(UploadFormComponent))

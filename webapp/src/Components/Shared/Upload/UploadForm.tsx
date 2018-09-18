import {
    Button,
    ButtonBase,
    Card,
    CardActions,
    CardContent,
    CardHeader,
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
import {BakkesModAd} from "./BakkesModAd"
import {UploadDropzone} from "./UploadDropzone"

interface State {
    files: File[],
    rejected: File[]
}

type Props = WithStyles<typeof styles>

class UploadFormComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {files: [], rejected: []}
    }

    public render() {
        const {classes} = this.props
        const hasFilesSelected = this.state.files.length !== 0
        return (
            <Card>
                <CardHeader title={"Upload Replays"}/>
                <CardContent>
                    <BakkesModAd/>
                    <ButtonBase>
                        <UploadDropzone onDrop={this.handleDrop} files={this.state.files}/>
                    </ButtonBase>
                    {this.state.rejected.length !== 0 &&
                    <Typography color="error">
                        {this.state.rejected.length} file(s) were not selected as they do not end in ".replay".
                    </Typography>
                    }
                </CardContent>
                <CardActions>
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
                </CardActions>
            </Card>
        )
    }

    private readonly handleDrop: DropFilesEventHandler = (accepted, rejected) => {
        this.setState({
            files: accepted,
            rejected
        })
    }

    private readonly handleUpload = () => {
        uploadReplays(this.state.files)
            .then(this.clearFiles)
        // TODO: Handle success/failure
    }

    private readonly clearFiles = () => {
        this.setState({files: [], rejected: []})
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

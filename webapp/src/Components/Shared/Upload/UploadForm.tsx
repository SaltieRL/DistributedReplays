import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader, createStyles,
    Theme,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core"
import {ArrowDownward, CloudUpload} from "@material-ui/icons"
import * as React from "react"
import Dropzone, {DropFilesEventHandler} from "react-dropzone"
import {uploadReplays} from "../../../Requests/Global"

interface State {
    files: File[],
    rejected: File[]
}

type Props = WithStyles<typeof styles>

export class UploadFormComponent extends React.PureComponent<Props, State> {
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
                    <Dropzone
                        accept=".replay" onDrop={this.handleDrop}
                        className={classes.default}
                        activeClassName={classes.active}
                        disablePreview
                    >
                        <div className={classes.dropzoneContent}>
                            {hasFilesSelected ?
                                <>
                                    <Typography variant="subheading">
                                        Selected files:
                                    </Typography>
                                    <Typography>
                                        {this.state.files
                                            .map((file) => file.name)
                                            .join(",\n")}
                                    </Typography>
                                </>
                                :
                                <>
                                    <Typography align="center">
                                        Drop your .replay files here, or click to select files to upload.
                                    </Typography>
                                    <br/>
                                    <ArrowDownward/>
                                </>
                            }
                        </div>
                    </Dropzone>
                    {this.state.rejected.length !== 0 &&
                    <Typography color="error">
                        {this.state.rejected.length} file(s) were not selected as they do not end in ".replay".
                    </Typography>
                    }
                </CardContent>
                <CardActions>
                    <Button onClick={this.handleUpload} disabled={!hasFilesSelected}>
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
        // TODO: Handle success/failure
    }
}

const styles = (theme: Theme) => createStyles({
    active: {
        borderStyle: "solid",
        borderColor: "#6c6",
        backgroundColor: "#eee"
    },
    default: {
        width: "550px",
        height: "430px",
        maxWidth: "90vw",
        maxHeight: "90vh",
        borderWidth: 2,
        borderColor: "#666",
        borderStyle: "dashed",
        borderRadius: 5
    },
    dropzoneContent: {
        position: "absolute",
        bottom: "50%",
        width: "100%",
        textAlign: "center"
    },
    leftIcon: {
        marginRight: theme.spacing.unit
    }
})


export const UploadForm = withStyles(styles)(UploadFormComponent)

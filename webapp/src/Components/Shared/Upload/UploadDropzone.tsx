import { ButtonBase, createStyles, Theme, Typography, WithStyles, withStyles } from "@material-ui/core"
import ArrowDownward from "@material-ui/icons/ArrowDownward"
import * as React from "react"
import Dropzone, { DropEvent } from "react-dropzone"

const styles = (theme: Theme) => createStyles({
    active: {
        borderStyle: "solid",
        borderColor: "#6c6",
        backgroundColor: theme.palette.type === "dark" ? "#333" : "#ccc"
    },
    default: {
        "width": 550,
        "height": 430,
        "maxWidth": "80vw",
        "maxHeight": "90vh",
        "borderWidth": 2,
        "borderColor": "#666",
        "borderStyle": "dashed",
        "borderRadius": 5,
        "cursor": "pointer",
        "backgroundColor": theme.palette.type === "dark" ? "#111" : "#eee",
        "display": "flex",
        "alignItems": "center",
        "&:hover": {
            backgroundColor: theme.palette.type === "dark" ? "#222" : "#ddd"
        }
    },
    dropzoneContent: {
        position: "absolute",
        width: "100%",
        textAlign: "center",
        padding: 20
    }
})

interface OwnProps {
    files: File[]
    onDrop: <T extends File>(acceptedFiles: T[], rejectedFiles: T[], event: DropEvent) => void
}

type Props = OwnProps
    & WithStyles<typeof styles>

class UploadDropzoneComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, files, onDrop} = this.props
        const hasFilesSelected = files.length !== 0
        const maxShownReplays = 7
        return (
            <Dropzone accept=".replay" onDrop={onDrop}>
                {(state) => (
                    <ButtonBase
                        focusRipple
                        className={state.isDragAccept ? classes.active : classes.default}
                        {...state.getRootProps()}
                    >
                        <input {...state.getInputProps()}/>
                        <div className={classes.dropzoneContent}>
                            {hasFilesSelected ? (
                                <>
                                    <Typography variant="subtitle1">
                                        Selected {files.length} files:
                                    </Typography>
                                    <br/>
                                    <Typography>
                                        {files.slice(0, maxShownReplays)
                                            .map((file: File) => file.name)
                                            .join(",\n")}
                                    </Typography>
                                    {files.length > maxShownReplays && (
                                        <Typography>
                                            and {files.length - maxShownReplays} more...
                                        </Typography>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Typography align="center" variant="subtitle1">
                                        Drop your .replay files here, or click to select files to upload.
                                    </Typography>
                                    <Typography align="center">
                                        Replays can be found in your Documents/My Games/Rocket League/TAGame/Demos/
                                        folder
                                    </Typography>
                                    <br/>
                                    <Typography><ArrowDownward/></Typography>
                                </>
                            )}
                        </div>
                    </ButtonBase>
                )}
            </Dropzone>
        )
    }
}

export const UploadDropzone = withStyles(styles)(UploadDropzoneComponent)

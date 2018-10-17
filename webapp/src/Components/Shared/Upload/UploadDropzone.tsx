import { ButtonBase, createStyles, Typography, WithStyles, withStyles } from "@material-ui/core"
import ArrowDownward from "@material-ui/icons/ArrowDownward"
import * as React from "react"
import Dropzone, { DropFilesEventHandler } from "react-dropzone"

interface OwnProps {
    files: File[]
    onDrop: DropFilesEventHandler
}

type Props = OwnProps & WithStyles<typeof styles>

class UploadDropzoneComponent extends React.PureComponent<Props> {
    public render() {
        const { classes, files, onDrop } = this.props
        const hasFilesSelected = files.length !== 0
        const maxShownReplays = 7
        return (
            <Dropzone
                accept=".replay"
                onDrop={onDrop}
                className={classes.default}
                activeClassName={classes.active}
                disablePreview
            >
                <ButtonBase style={{ width: "100%", height: "100%" }} focusRipple>
                    <div className={classes.dropzoneContent}>
                        {hasFilesSelected ? (
                            <>
                                <Typography variant="subheading">Selected {files.length} files:</Typography>
                                <br />
                                <Typography>
                                    {files
                                        .slice(0, maxShownReplays)
                                        .map((file: File) => file.name)
                                        .join(",\n")}
                                </Typography>
                                {files.length > maxShownReplays && (
                                    <Typography>and {files.length - maxShownReplays} more...</Typography>
                                )}
                            </>
                        ) : (
                            <>
                                <Typography align="center" variant="subheading">
                                    Drop your .replay files here, or click to select files to upload.
                                </Typography>
                                <Typography align="center">
                                    Replays can be found in your Documents/My Games/Rocket League/TAGame/Demos/ folder
                                </Typography>
                                <br />
                                <ArrowDownward />
                            </>
                        )}
                    </div>
                </ButtonBase>
            </Dropzone>
        )
    }
}

const styles = createStyles({
    active: {
        borderStyle: "solid",
        borderColor: "#6c6",
        backgroundColor: "#ccc"
    },
    default: {
        width: 550,
        height: 430,
        maxWidth: "80vw",
        maxHeight: "90vh",
        borderWidth: 2,
        borderColor: "#666",
        borderStyle: "dashed",
        borderRadius: 5,
        cursor: "pointer",
        backgroundColor: "#eee",
        display: "flex",
        alignItems: "center",
        "&:hover": {
            backgroundColor: "#ddd"
        }
    },
    dropzoneContent: {
        position: "absolute",
        width: "100%",
        textAlign: "center",
        padding: 20
    }
})

export const UploadDropzone = withStyles(styles)(UploadDropzoneComponent)

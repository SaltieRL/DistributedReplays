import {Button, WithStyles, withStyles} from "@material-ui/core"
import CloudUpload from "@material-ui/icons/CloudUpload"
import * as React from "react"
import {buttonStyles} from "../LinkButton"

interface OwnProps {
    handleOpen: () => void
}

type Props = OwnProps
    & WithStyles<typeof buttonStyles>

export class UploadContainedButtonComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <>
                <Button variant="contained" color="primary" aria-label="upload" onClick={this.props.handleOpen}>
                    <CloudUpload className={this.props.classes.leftIcon}/>
                    Upload replay
                </Button>
            </>
        )
    }
}

export const UploadContainedButton = withStyles(buttonStyles)(UploadContainedButtonComponent)

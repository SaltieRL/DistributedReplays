import {Button, Tooltip} from "@material-ui/core"
import CloudUpload from "@material-ui/icons/CloudUpload"
import * as React from "react"

interface Props {
    handleOpen: () => void
}

export class UploadFloatingButton extends React.PureComponent<Props> {
    public render() {
        const buttonStyle: React.CSSProperties = {
            position: "fixed",
            bottom: "60px",
            right: "60px"
        }
        return (
            <Tooltip title="Upload replay">
                <Button variant="fab" color="secondary" aria-label="upload" style={buttonStyle}
                        onClick={this.props.handleOpen}>
                    <CloudUpload/>
                </Button>
            </Tooltip>
        )
    }
}

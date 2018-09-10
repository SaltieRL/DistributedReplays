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
            bottom: "40px",
            right: "40px"
        }
        return (
            <>
                <Tooltip title="Upload replay">
                    <Button variant="fab" color="primary" aria-label="upload" style={buttonStyle}
                            onClick={this.props.handleOpen}>
                        <CloudUpload/>
                    </Button>
                </Tooltip>
            </>
        )
    }
}

import {Button, Tooltip} from "@material-ui/core"
import CloudUpload from "@material-ui/icons/CloudUpload"
import * as React from "react"
import {UploadModal} from "./UploadModal"

interface State {
    open: boolean
}

export class UploadModalWrapper extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {
            open: false
        }
    }

    public handleOpen = () => {
        this.setState({open: true})
    }

    public handleClose = () => {
        this.setState({open: false})
    }

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
                            onClick={this.handleOpen}>
                        <CloudUpload/>
                    </Button>
                </Tooltip>
                <UploadModal open={this.state.open} handleClickOutside={this.handleClose}/>
                {this.props.children}
            </>
        )
    }
}

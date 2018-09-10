import * as React from "react"
import {UploadContainedButton} from "./UploadContainedButton"
import {UploadFloatingButton} from "./UploadFloatingButton"
import {UploadModal} from "./UploadModal"

interface Props {
    buttonStyle: "contained" | "floating"
}

interface State {
    open: boolean
}

export class UploadModalWrapper extends React.PureComponent<Props, State> {
    constructor(props: Props) {
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
        return (
            <>
                {this.props.buttonStyle === "floating"
                && <UploadFloatingButton handleOpen={this.handleOpen}/>}
                {this.props.buttonStyle === "contained"
                && <UploadContainedButton handleOpen={this.handleOpen}/>}
                <UploadModal open={this.state.open} handleClickOutside={this.handleClose}/>
                {this.props.children}
            </>
        )
    }
}

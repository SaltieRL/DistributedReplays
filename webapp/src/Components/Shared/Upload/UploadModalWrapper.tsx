import { IconButton, Tooltip, withWidth } from "@material-ui/core"
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import CloudUpload from "@material-ui/icons/CloudUpload"
import * as React from "react"
import { UploadContainedButton } from "./UploadContainedButton"
import { UploadFloatingButton } from "./UploadFloatingButton"
import { UploadModal } from "./UploadModal"

interface OwnProps {
    buttonStyle: "contained" | "floating" | "icon"
}

type Props = OwnProps & WithWidth

interface State {
    open: boolean
}

class UploadModalWrapperComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            open: false
        }
    }

    public handleOpen = () => {
        this.setState({ open: true })
    }

    public handleClose = () => {
        this.setState({ open: false })
    }

    public render() {
        const Icon = CloudUpload
        return (
            <>
                {isWidthUp("md", this.props.width) && (
                    <>
                        {this.props.buttonStyle === "floating" && (
                            <UploadFloatingButton handleOpen={this.handleOpen} Icon={Icon} />
                        )}
                        {this.props.buttonStyle === "contained" && (
                            <UploadContainedButton handleOpen={this.handleOpen} Icon={Icon} />
                        )}
                        {this.props.buttonStyle === "icon" && (
                            <Tooltip title="Upload replays">
                                <IconButton onClick={this.handleOpen}>
                                    <Icon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </>
                )}
                <UploadModal open={this.state.open} handleClickOutside={this.handleClose} />
                {this.props.children}
            </>
        )
    }
}

export const UploadModalWrapper = withWidth()(UploadModalWrapperComponent)

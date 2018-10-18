import { Badge, IconButton, Tooltip, withWidth } from "@material-ui/core"
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import CloudUpload from "@material-ui/icons/CloudUpload"
import * as React from "react"
import { getCurrentUploadStatuses } from "./StatusUtils"
import { UploadContainedButton } from "./UploadContainedButton"
import { UploadDialog } from "./UploadDialog"
import { UploadFloatingButton } from "./UploadFloatingButton"

interface OwnProps {
    buttonStyle: "contained" | "floating" | "icon"
}

type Props = OwnProps
    & WithWidth

interface State {
    open: boolean
    currentUploadsCount: number
}

class UploadDialogWrapperComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            open: false,
            currentUploadsCount: 0
        }
    }

    public componentDidMount() {
        this.getPendingUploads()
        // TODO: Create refresh capability
        // TODO: Create proper UI display for progress.
    }

    public handleOpen = () => {
        this.setState({open: true})
    }

    public handleClose = () => {
        this.setState({open: false})
    }

    public render() {
        const Icon = CloudUpload
        return (
            <>
                {isWidthUp("md", this.props.width) &&
                <>
                    {this.props.buttonStyle === "floating" &&
                    <UploadFloatingButton handleOpen={this.handleOpen} Icon={Icon}/>}
                    {this.props.buttonStyle === "contained" &&
                    <UploadContainedButton handleOpen={this.handleOpen} Icon={Icon}/>}
                    {this.props.buttonStyle === "icon" &&
                    <Tooltip title="Upload replays">
                        <IconButton onClick={this.handleOpen}>
                            {this.state.currentUploadsCount === 0 ?
                                <Icon/>
                                :
                                <Badge badgeContent={this.state.currentUploadsCount} color="secondary">
                                    <Icon/>
                                </Badge>
                            }
                        </IconButton>
                    </Tooltip>}
                </>}
                <UploadDialog open={this.state.open} handleClickOutside={this.handleClose}/>
                {this.props.children}
            </>
        )
    }

    private readonly getPendingUploads = () => {
        getCurrentUploadStatuses()
            .then((uploadStatuses) => this.setState({
                currentUploadsCount: uploadStatuses
                    .filter((uploadStatus) => uploadStatus === "PENDING")
                    .length
            }))
        // TODO: Move taskIds to redux store? Clear SUCCESSes? Store statuses in redux store?
    }
}

export const UploadDialogWrapper = withWidth()(UploadDialogWrapperComponent)

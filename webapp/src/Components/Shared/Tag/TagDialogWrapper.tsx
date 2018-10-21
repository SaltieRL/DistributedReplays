import { faTags } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconButton, Tooltip } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models/Replay/Replay"
import { TagDialog } from "./TagDialog"

interface Props {
    replay: Replay
}

interface State {
    open: boolean
}

export class TagDialogWrapper extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {open: false}
    }

    public render() {
        return (
            <>
                <Tooltip title="View/Edit Tags">
                    <IconButton onClick={this.handleOpen}>
                        <FontAwesomeIcon icon={faTags}/>
                    </IconButton>
                </Tooltip>
                <TagDialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    replay={this.props.replay}
                />
            </>
        )
    }

    private readonly handleOpen = () => {
        this.setState({open: true})
    }

    private readonly handleClose = () => {
        this.setState({open: false})
    }
}

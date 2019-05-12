import { faTags } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { createStyles, IconButton, Tooltip, WithStyles, withStyles } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models/Replay/Replay"
import { TagDialog } from "./TagDialog"

interface OwnProps {
    replay: Replay
    handleUpdateTags: (tags: Tag[]) => void
    small?: true
}

type Props = OwnProps
    & WithStyles<typeof styles>

interface State {
    open: boolean
}

class TagDialogWrapperComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {open: false}
    }

    public render() {
        const {replay, handleUpdateTags, small, classes} = this.props
        return (
            <>
                <Tooltip title="View/Edit Tags">
                    <IconButton onClick={this.handleOpen} className={small ? classes.smallIconButton : undefined}>
                        <FontAwesomeIcon icon={faTags} className={small ? classes.smallIcon + " fa-xs" : undefined}/>
                    </IconButton>
                </Tooltip>
                <TagDialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    replay={replay}
                    handleUpdateTags={handleUpdateTags}
                />
            </>
        )
    }

    private readonly handleOpen: React.MouseEventHandler = (event) => {
        this.setState({open: true})
    }

    private readonly handleClose: React.ReactEventHandler<{}> = (event) => {
        this.setState({open: false})
    }
}

const styles = createStyles({
    smallIconButton: {
        padding: 4
    },
    smallIcon: {
        height: 22.5
    }
})

export const TagDialogWrapper = withStyles(styles)(TagDialogWrapperComponent)

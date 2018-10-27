import { Checkbox, FormControlLabel, IconButton, Menu, MenuItem, withWidth } from "@material-ui/core"
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import MoreVert from "@material-ui/icons/MoreVert"
import Send from "@material-ui/icons/Send"
import * as H from "history"
import * as React from "react"
import { LinkButton } from "../Shared/LinkButton"

interface OwnProps {
    disabled: boolean
    selectable: boolean
    handleSelectableChange: (event: React.ChangeEvent<HTMLInputElement>, selectable: boolean) => void
    to: H.LocationDescriptor
}

type Props = OwnProps
    & WithWidth

interface State {
    open: boolean
    anchorElement?: HTMLElement
}

class ResultsActionsComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {open: false}
    }

    public render() {
        const checkbox = (
            <FormControlLabel
                control={<Checkbox checked={this.props.selectable}
                                   onChange={this.props.handleSelectableChange}/>}
                label="Select mode"
            />
        )
        const linkButton = (
            <LinkButton icon={Send} iconType="mui"
                        to={this.props.to}
                        disabled={this.props.disabled}
                        tooltip="Select at least one replay to view as group">
                View as group
            </LinkButton>
        )

        return (
            <div style={{paddingRight: 8}}>
                {isWidthUp("sm", this.props.width) ?
                    <div style={{display: "flex"}}>
                        {checkbox}
                        {linkButton}
                    </div>
                    :
                    <>
                        <IconButton onClick={this.handleOpen}>
                            <MoreVert/>
                        </IconButton>
                        <Menu
                            open={this.state.open}
                            anchorEl={this.state.anchorElement}
                            onClose={this.handleClose}
                        >
                            <MenuItem>
                                {checkbox}
                            </MenuItem>
                            <MenuItem>
                                {linkButton}
                            </MenuItem>
                        </Menu>
                    </>
                }
            </div>
        )
    }

    private readonly handleOpen: React.MouseEventHandler<HTMLElement> = (event) => {
        this.setState({
            open: true,
            anchorElement: event.currentTarget
        })
    }

    private readonly handleClose = () => {
        this.setState({
            open: false,
            anchorElement: undefined
        })
    }
}

export const ResultsActions = withWidth()(ResultsActionsComponent)

import { IconButton, Menu, MenuItem } from "@material-ui/core"
import ArrowDropDown from "@material-ui/icons/ArrowDropDown"
import * as React from "react"

interface Props {
    pastNames: string[]
}

interface State {
    open: boolean
    anchorElement?: HTMLElement
}

export class PlayerNameDropdown extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {open: false}
    }

    public render() {
        return (
            <>
                <IconButton style={{width: 32, height: 32, padding: 0, marginRight: "auto"}}
                            onClick={this.handleOpen}>
                    <ArrowDropDown/>
                </IconButton>
                <Menu open={this.state.open}
                      onClose={this.handleClose}
                      anchorEl={this.state.anchorElement}
                >
                    {this.props.pastNames.map((name) =>
                        <MenuItem key={name} onClick={this.handleClose}>
                            {name}
                        </MenuItem>
                    )}
                </Menu>
            </>
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

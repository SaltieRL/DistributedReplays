import { Fab, Tooltip } from "@material-ui/core"
import { SvgIconProps } from "@material-ui/core/SvgIcon"
import * as React from "react"

interface Props {
    handleOpen: () => void
    Icon: React.ComponentType<SvgIconProps>
}

export class UploadFloatingButton extends React.PureComponent<Props> {
    public render() {
        const {Icon, handleOpen} = this.props
        const buttonStyle: React.CSSProperties = {
            position: "fixed",
            bottom: "60px",
            right: "60px"
        }
        return (
            <Tooltip title="Upload replays">
                <Fab color="secondary" aria-label="upload" style={buttonStyle}
                        onClick={handleOpen}>
                    <Icon/>
                </Fab>
            </Tooltip>
        )
    }
}

import {Button, WithStyles, withStyles} from "@material-ui/core"
import {SvgIconProps} from "@material-ui/core/SvgIcon"
import * as React from "react"
import {buttonStyles} from "../LinkButton"

interface OwnProps {
    handleOpen: () => void
    Icon: React.ComponentType<SvgIconProps>
}

type Props = OwnProps
    & WithStyles<typeof buttonStyles>

class UploadContainedButtonComponent extends React.PureComponent<Props> {
    public render() {
        const {Icon, handleOpen} = this.props
        return (
            <>
                <Button variant="contained" color="primary" aria-label="upload" onClick={handleOpen}>
                    <Icon className={this.props.classes.leftIcon}/>
                    Upload replays
                </Button>
            </>
        )
    }
}

export const UploadContainedButton = withStyles(buttonStyles)(UploadContainedButtonComponent)

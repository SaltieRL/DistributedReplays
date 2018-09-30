import {IconDefinition} from "@fortawesome/fontawesome-common-types"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button, createStyles, Theme, Tooltip, WithStyles, withStyles} from "@material-ui/core"
import {SvgIconProps} from "@material-ui/core/SvgIcon"
import * as H from "history"
import * as React from "react"
import {Link} from "react-router-dom"

interface InternalLinkProps {
    isExternalLink?: false
    to: H.LocationDescriptor
}

interface ExternalLinkProps {
    isExternalLink: true
    to: string
}

interface MuiIconProps {
    iconType: "mui"
    icon: React.ComponentType<SvgIconProps>
}

interface FontAwesomIconProps {
    iconType: "fontawesome"
    icon: IconDefinition
}

type IconProps = MuiIconProps | FontAwesomIconProps

interface OwnProps {
    iconPosition?: "left"
    tooltip?: string
}  // TODO: Make use of iconPosition

type LinkButtonProps = OwnProps
    & IconProps
    & (InternalLinkProps | ExternalLinkProps)
    & WithStyles<typeof buttonStyles>

class LinkButtonComponent extends React.PureComponent<LinkButtonProps> {
    public render() {
        const {classes, children, isExternalLink, tooltip} = this.props
        const className = children ? `${classes.icon} ${classes.leftIcon}` : classes.icon
        let button =
            <Button variant="outlined" style={{height: "100%"}}>
                {this.props.iconType === "fontawesome" &&
                <FontAwesomeIcon icon={this.props.icon} className={className}/>
                }
                {this.props.iconType === "mui" &&
                <this.props.icon className={className}/>
                }
                {children}
            </Button>

        if (tooltip) {
            button =
                <Tooltip title={tooltip} placement="bottom" PopperProps={{className: classes.tooltip}}>
                    {button}
                </Tooltip>
        }

        return (
            <>
                {isExternalLink === true ?
                    (<a href={this.props.to as string} target="_blank" style={{textDecoration: "none"}}>
                        {button}
                    </a>)
                    :
                    (<Link to={this.props.to} style={{textDecoration: "none"}}>
                        {button}
                    </Link>)
                }
            </>
        )
    }
}

export const buttonStyles = (theme: Theme) => createStyles({
    button: {
        margin: theme.spacing.unit
    },
    icon: {
        height: "24px !important",
        width: "24px !important",
        color: "rgba(0, 0, 0, 0.54)"
    },
    leftIcon: {
        marginRight: theme.spacing.unit
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    },
    tooltip: {
        // left: "6px !important"
        // TODO: Fix alignment of tooltip
    }
})

export const LinkButton = withStyles(buttonStyles)(LinkButtonComponent)

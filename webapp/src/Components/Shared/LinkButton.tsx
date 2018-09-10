import {IconDefinition} from "@fortawesome/fontawesome-common-types"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button, Theme, WithStyles, withStyles} from "@material-ui/core"
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

interface OwnProps {
    leftIcon?: IconDefinition
}

type LinkButtonProps = OwnProps
    & (InternalLinkProps | ExternalLinkProps)
    & WithStyles<typeof buttonStyles>


class LinkButtonComponent extends React.PureComponent<LinkButtonProps> {
    public render() {
        const {classes, children, isExternalLink} = this.props
        const button =
            <Button variant="outlined">
                {this.props.leftIcon &&
                <FontAwesomeIcon icon={this.props.leftIcon} className={classes.leftIcon}/>
                }
                {children}
            </Button>

        return (
            <>
                {isExternalLink === true ?
                    (<a href={this.props.to as string} style={{textDecoration: "none"}}>
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

export const buttonStyles = (theme: Theme) => ({
    button: {
        margin: theme.spacing.unit
    },
    leftIcon: {
        marginRight: theme.spacing.unit
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    }
})

export const LinkButton = withStyles(buttonStyles)(LinkButtonComponent)

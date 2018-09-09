import {IconDefinition} from "@fortawesome/fontawesome-common-types"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button, Theme, WithStyles, withStyles} from "@material-ui/core"
import * as React from "react"
import {Link, LinkProps} from "react-router-dom"

interface OwnProps {
    leftIcon?: IconDefinition
}

type Props = OwnProps
    & LinkProps
    & WithStyles<typeof styles>

class LinkButtonComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, children} = this.props
        return (
            <Link to={this.props.to} style={{textDecoration: "none"}}>
                <Button variant="outlined">
                    {this.props.leftIcon &&
                    <FontAwesomeIcon icon={this.props.leftIcon} className={classes.leftIcon}/>
                    }
                    {children}
                </Button>
            </Link>
        )
    }
}

const styles = (theme: Theme) => ({
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

export const LinkButton = withStyles(styles)(LinkButtonComponent)

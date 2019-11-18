import * as React from "react"

import {createStyles, Toolbar, WithStyles, withStyles, withWidth} from "@material-ui/core"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"

const styles = createStyles({
    content: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flex: 1
    }
})

type Props = WithStyles<typeof styles> & WithWidth

class PageContentComponent extends React.PureComponent<Props> {
    public render() {
        const {classes} = this.props
        const aboveSm = isWidthUp("sm", this.props.width)
        return (
            <div className={classes.content}>
                <Toolbar />
                <div style={{padding: aboveSm ? 20 : 3, minHeight: "100%", overflowX: aboveSm ? undefined : "hidden"}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export const PageContent = withWidth()(withStyles(styles)(PageContentComponent))

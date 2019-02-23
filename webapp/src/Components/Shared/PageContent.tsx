import * as React from "react"

import { createStyles, Toolbar, WithStyles, withStyles, withWidth } from "@material-ui/core"
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"

type Props = WithStyles<typeof styles> & WithWidth

class PageContentComponent extends React.PureComponent<Props> {
    public render() {
        const {classes} = this.props
        return (
            <div className={classes.content}>
                <Toolbar/>
                <div style={{padding: isWidthUp("sm", this.props.width) ? 20 : 3, minHeight: "100%"}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

const styles = createStyles({
    content: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flex: 1
    }
})

export const PageContent = withWidth()(withStyles(styles)(PageContentComponent))

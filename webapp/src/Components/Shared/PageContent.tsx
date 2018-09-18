import * as React from "react"

import {createStyles, Toolbar, WithStyles, withStyles} from "@material-ui/core"

type Props = WithStyles<typeof styles>

class PageContentComponent extends React.PureComponent<Props> {
    public render() {
        const {classes} = this.props
        return (
            <div className={classes.content}>
                <Toolbar/>
                <div style={{padding: 20, minHeight: "100%"}}>
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

export const PageContent = withStyles(styles)(PageContentComponent)

import { createStyles, Grid, WithStyles, withStyles } from "@material-ui/core"
import * as React from "react"
import { Footer } from "../Shared/Footer"
import { NavBar } from "../Shared/NavBar/NavBar"
import { PageContent } from "../Shared/PageContent"

interface OwnProps {
    backgroundImage?: string
}

type Props = OwnProps
    & WithStyles<typeof styles>

class BasePageComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, backgroundImage} = this.props
        return (
            <Grid container direction="column"
                  className={backgroundImage ? classes.withBackgroundImage : undefined}
                  style={backgroundImage ? {backgroundImage: `url("${backgroundImage}")`} : undefined}
            >
                <NavBar/>
                <PageContent>
                    {this.props.children}
                </PageContent>
                <Footer/>
            </Grid>
        )
    }
}

const styles = createStyles({
    withBackgroundImage: {
        backgroundSize: "cover",
        backgroundAttachment: "fixed"
    }
})

export const BasePage = withStyles(styles)(BasePageComponent)

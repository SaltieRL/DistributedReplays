import { createStyles, Grid, WithStyles, withStyles, withTheme, WithTheme } from "@material-ui/core"
import * as React from "react"
import { Footer } from "../Shared/Footer"
import { NavBar } from "../Shared/NavBar/NavBar"
import { PageContent } from "../Shared/PageContent"
import { SideBar } from "../Shared/SideBar"

const styles = createStyles({
    withBackgroundImage: {
        backgroundSize: "cover",
        backgroundAttachment: "fixed"
    }
})

interface OwnProps {
    backgroundImage?: string
    useSplash?: boolean
}

type Props = OwnProps
    & WithStyles<typeof styles> & WithTheme

interface State {
    sideBarOpen: boolean
}

class BasePageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {sideBarOpen: false}
    }

    public render() {
        const {classes, theme} = this.props

        const backgroundImage = this.props.useSplash ? (
            theme.palette.type === "dark" ? "/splash_black.png" : "/splash.png"
        ) : this.props.backgroundImage

        return (
            <Grid container direction="column"
                  className={backgroundImage ? classes.withBackgroundImage : undefined}
                  style={backgroundImage ? {backgroundImage: `url("${backgroundImage}")`} : undefined}
            >
                <NavBar toggleSideBar={this.toggleSideBar}/>
                <SideBar open={this.state.sideBarOpen} onClose={this.toggleSideBar}/>
                <PageContent>
                    {this.props.children}
                </PageContent>
                <Footer/>
            </Grid>
        )
    }

    private readonly toggleSideBar = () => {
        this.setState({sideBarOpen: !this.state.sideBarOpen})
    }
}

export const BasePage = withTheme(withStyles(styles)(BasePageComponent))

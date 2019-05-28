import { createStyles, Grid, WithStyles, withStyles } from "@material-ui/core"
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
}

type Props = OwnProps
    & WithStyles<typeof styles>

interface State {
    sideBarOpen: boolean
}

class BasePageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {sideBarOpen: false}
    }

    public render() {
        const {classes, backgroundImage} = this.props
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

export const BasePage = withStyles(styles)(BasePageComponent)

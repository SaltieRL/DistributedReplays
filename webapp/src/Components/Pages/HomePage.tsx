import * as React from "react"
import {Logo} from "../Shared/Logo/Logo"
import {Search} from "../Shared/Search"

import {faGlobeAmericas} from "@fortawesome/free-solid-svg-icons"
import {createStyles, Grid, Theme, WithStyles, withStyles} from "@material-ui/core"
import Divider from "@material-ui/core/Divider/Divider"
import {GridProps} from "@material-ui/core/Grid"
import {LinkButton} from "../Shared/LinkButton"
import {UploadModalWrapper} from "../Shared/Upload/UploadModalWrapper"

type Props = WithStyles<typeof styles>

class HomePageComponent extends React.PureComponent<Props> {
    public render() {
        const {classes} = this.props

        const alignCenterProps: GridProps = {container: true, justify: "center", alignItems: "center"}
        return (
            <UploadModalWrapper>
                <div className={classes.root}>
                    <Grid container justify="center" alignItems="flex-start" spacing={40} className={classes.child}>
                        <Grid item xs={12} {...alignCenterProps} style={{minHeight: "300px"}}>
                            <Logo/>
                        </Grid>
                        <Grid item xs={11} {...alignCenterProps} style={{padding: "20px 0 20px 0"}}>
                            <Search/>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider/>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={6} xl={4}>
                            <HomePageFooter/>
                        </Grid>
                        {/*<div className="hotlinks">*/}
                        {/*<FrameBoxLink to="/replay/stats">*/}
                        {/*global stats*/}
                        {/*</FrameBoxLink>*/}
                        {/*<FrameBoxLink to="/replay/upload">*/}
                        {/*upload replay*/}
                        {/*</FrameBoxLink>*/}
                        {/*</div>*/}
                        {/*<div className="hotlinks">*/}
                        {/*<span>1337 replays and counting...</span>*/}
                        {/*/!*TODO: Make call to get number of replays*!/*/}
                        {/*</div>*/}
                    </Grid>
                </div>
            </UploadModalWrapper>
        )
    }
}

const HomePageFooter: React.SFC = () => {
    const linkButtonGridItemProps: GridProps = {item: true, xs: 12, sm: 4, md: 2, style: {textAlign: "center"}}
    return (
        <Grid container justify="center" spacing={16}>
            <Grid item xs={12} sm={12} md={4} style={{textAlign: "center"}}>
                <LinkButton to="/replay/stats" leftIcon={faGlobeAmericas}> global stats </LinkButton>
            </Grid>
            <Grid {...linkButtonGridItemProps}>
                <LinkButton to=""> about </LinkButton>
            </Grid>
            <Grid {...linkButtonGridItemProps}>
                <LinkButton to="/redirect_to/github"> github </LinkButton>
            </Grid>
            <Grid {...linkButtonGridItemProps}>
                <LinkButton to=""> discord </LinkButton>
            </Grid>
        </Grid>
    )
}


const styles = (theme: Theme) => createStyles({
    root: {
        margin: "auto",
        width: "100%",
        overflowX: "hidden"
    },
    child: {
        margin: "auto",
        padding: "20px",
        height: "100%",
        width: "100%"
    }
})

export const HomePage = (withStyles(styles)(HomePageComponent))

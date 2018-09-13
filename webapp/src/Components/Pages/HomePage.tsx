import * as React from "react"
import {Logo} from "../Shared/Logo/Logo"
import {Search} from "../Shared/Search"

import {faDiscord, faGithub, faSteam} from "@fortawesome/free-brands-svg-icons"
import {faChartBar} from "@fortawesome/free-solid-svg-icons"
import {createStyles, Grid, Typography, WithStyles, withStyles} from "@material-ui/core"
import Divider from "@material-ui/core/Divider/Divider"
import {GridProps} from "@material-ui/core/Grid"
import {CloudUpload, Info} from "@material-ui/icons"
import {getReplayCount} from "../../Requests/Global"
import {LinkButton} from "../Shared/LinkButton"
import {UploadModalWrapper} from "../Shared/Upload/UploadModalWrapper"

type Props = WithStyles<typeof styles>

interface State {
    replayCount?: number
}

class HomePageComponent extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        getReplayCount()
            .then((replayCount: number) => this.setState({replayCount}))
    }

    public render() {
        const {classes} = this.props

        const alignCenterProps: GridProps = {container: true, justify: "center", alignItems: "center"}
        return (
            <UploadModalWrapper buttonStyle="floating">
                <div className={classes.root}>
                    <Grid container justify="center" alignItems="flex-start" spacing={40} className={classes.child}>
                        <Grid item xs={12} {...alignCenterProps} style={{minHeight: "300px"}} direction="column">
                            <Logo imgStyle={{maxWidth: "80vw"}}/>
                            {this.state.replayCount &&
                            <>
                                <br/>
                                <Typography>
                                    <i>1337 replays and counting...</i>
                                </Typography>
                            </>
                            }
                        </Grid>
                        <Grid item xs={11} {...alignCenterProps} style={{padding: "20px 0 20px 0"}}>
                            <Search usePaper/>
                        </Grid>
                        <Grid item xs={12} sm={10} md={8} container spacing={16} alignItems="center"
                              style={{maxWidth: 550}}>
                            <Grid item xs={6} style={{textAlign: "center"}}>
                                <LinkButton to="/auth/steam" iconType="fontawesome" icon={faSteam}>
                                    Log in with Steam
                                </LinkButton>
                            </Grid>
                            <Grid item xs={6} style={{textAlign: "center"}}>
                                <LinkButton to="/replays/upload" iconType="mui" icon={CloudUpload}>
                                    Upload replays
                                </LinkButton>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider/>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={6} xl={4}>
                            <HomePageFooter/>
                        </Grid>
                    </Grid>
                </div>
            </UploadModalWrapper>
        )
    }
}

const HomePageFooter: React.SFC = () => {
    const linkButtonGridItemProps: GridProps = {item: true, xs: 3, sm: 3, md: 2, style: {textAlign: "center"}}
    return (
        <Grid container justify="center" spacing={16}>
            <Grid {...linkButtonGridItemProps}>
                <LinkButton to="/replay/stats"
                            iconType="fontawesome" icon={faChartBar}
                            tooltip="Global stats"/>
            </Grid>
            <Grid {...linkButtonGridItemProps}>
                <LinkButton to=""
                            iconType="mui" icon={Info}
                            tooltip="About"/>
            </Grid>
            <Grid {...linkButtonGridItemProps}>
                <LinkButton to="/redirect_to/github"
                            iconType="fontawesome" icon={faGithub}
                            tooltip="Github"/>
            </Grid>
            <Grid {...linkButtonGridItemProps}>
                <LinkButton to=""
                            iconType="fontawesome" icon={faDiscord}
                            tooltip="Discord"/>
            </Grid>
        </Grid>
    )
}


const styles = createStyles({
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

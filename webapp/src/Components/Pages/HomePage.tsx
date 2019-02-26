import { faDiscord, faGithub, faRedditAlien, faSteam, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faChartBar } from "@fortawesome/free-solid-svg-icons"
import { Button, createStyles, Divider, Grid, Typography, WithStyles, withStyles, withWidth } from "@material-ui/core"
import { GridProps } from "@material-ui/core/Grid"
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import CloudUpload from "@material-ui/icons/CloudUpload"
import Info from "@material-ui/icons/Info"
import * as React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { Dispatch } from "redux"
import {
    ABOUT_LINK,
    DISCORD_LINK,
    GITHUB_LINK,
    GLOBAL_STATS_LINK,
    LOCAL_LINK,
    PLAYER_PAGE_LINK,
    REDDIT_LINK,
    STEAM_LOGIN_LINK,
    TWITTER_LINK,
    UPLOAD_LINK
} from "../../Globals"
import { LoggedInUserActions, StoreState } from "../../Redux"
import { getLoggedInUser, getReplayCount } from "../../Requests/Global"
import { LinkButton } from "../Shared/LinkButton"
import { Logo } from "../Shared/Logo/Logo"
import { Search } from "../Shared/Search"
import { UploadDialogWrapper } from "../Shared/Upload/UploadDialogWrapper"

type Props = ReturnType<typeof mapStateToProps>
    & ReturnType<typeof mapDispatchToProps>
    & WithStyles<typeof styles>
    & WithWidth

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
        getLoggedInUser()
            .then((loggedInUser) => this.props.setLoggedInUser(loggedInUser))
            .catch(() => undefined)
    }

    public render() {
        const {classes, width, loggedInUser} = this.props

        const alignCenterProps: GridProps = {container: true, justify: "center", alignItems: "center"}
        return (
            <div className={classes.backgroundContainer}>
                <UploadDialogWrapper buttonStyle="floating">
                    <div className={classes.root}>
                        <Grid container justify="center" alignItems="flex-start" spacing={40} className={classes.child}>
                            <Grid item xs={12} {...alignCenterProps} style={{minHeight: "300px"}} direction="column">
                                <Logo imgStyle={{maxWidth: "80vw"}}/>
                                {this.state.replayCount &&
                                <>
                                    <br/>
                                    <Typography>
                                        <i>{this.state.replayCount} replays and counting...</i>
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
                                    {loggedInUser ?
                                        <Link to={PLAYER_PAGE_LINK(loggedInUser.id)} style={{textDecoration: "none"}}>
                                            <Button variant="outlined">
                                                <img src={loggedInUser.avatarLink}
                                                     style={{marginRight: 8, height: 24, width: 24}}/>
                                                View Profile
                                            </Button>
                                        </Link>
                                        :
                                        <LinkButton to={LOCAL_LINK + STEAM_LOGIN_LINK} isExternalLink
                                                    iconType="fontawesome" icon={faSteam}>
                                            {isWidthUp("sm", width) ? "Log in with Steam" : "Log in"}
                                        </LinkButton>
                                    }
                                </Grid>
                                <Grid item xs={6} style={{textAlign: "center"}}>
                                    <LinkButton to={UPLOAD_LINK} iconType="mui" icon={CloudUpload}>
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
                </UploadDialogWrapper>
            </div>
        )
    }
}

const HomePageFooterComponent: React.SFC<WithWidth> = (props: WithWidth) => {

    const globalStatsLinkButton = (
        <LinkButton to={GLOBAL_STATS_LINK}
                    iconType="fontawesome" icon={faChartBar}
                    tooltip="Global stats"/>
    )
    const aboutLinkButton = (
        <LinkButton to={ABOUT_LINK}
                    iconType="mui" icon={Info}
                    tooltip="About"/>
    )
    const twitterLinkButton = (
        <LinkButton to={TWITTER_LINK} isExternalLink
                    iconType="fontawesome" icon={faTwitter}
                    tooltip="Twitter"/>
    )
    const discordLinkButton = (
        <LinkButton to={DISCORD_LINK} isExternalLink
                    iconType="fontawesome" icon={faDiscord}
                    tooltip="Discord"/>
    )
    const githubLinkButton = (
        <LinkButton to={GITHUB_LINK} isExternalLink
                    iconType="fontawesome" icon={faGithub}
                    tooltip="Github"/>
    )
    const redditLinkButton = (
        <LinkButton to={REDDIT_LINK} isExternalLink
                    iconType="fontawesome" icon={faRedditAlien}
                    tooltip="Reddit"/>
    )

    return (
        <Grid container justify="center" spacing={16}>
            {isWidthUp("md", props.width) ?
                [globalStatsLinkButton, aboutLinkButton, twitterLinkButton, discordLinkButton,
                    githubLinkButton, redditLinkButton]
                    .map((linkButton, i) => (
                        <Grid item xs={3} md={2} style={{textAlign: "center"}} key={i}>
                            {linkButton}
                        </Grid>
                    ))
                :
                <>
                    {
                        [
                            [globalStatsLinkButton, aboutLinkButton],
                            [twitterLinkButton, discordLinkButton, githubLinkButton, redditLinkButton]
                        ]
                            .map((linkButtonRow, i) => (
                                <Grid item xs={12} container justify="space-around" key={i}>
                                    {linkButtonRow.map((linkButton, j) => (
                                        <Grid item xs="auto" style={{textAlign: "center"}} key={j}>
                                            {linkButton}
                                        </Grid>
                                    ))
                                    }
                                </Grid>
                            ))
                    }
                </>
            }
        </Grid>
    )
}

const HomePageFooter = withWidth()(HomePageFooterComponent)

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
    },
    backgroundContainer: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundImage: 'url("/splash.png")'
    }
})

export const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
    setLoggedInUser: (loggedInUser: LoggedInUser) => dispatch(LoggedInUserActions.setLoggedInUserAction(loggedInUser))
})

export const HomePage = withWidth()(withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(HomePageComponent)
))

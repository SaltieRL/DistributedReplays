import {faSteam} from "@fortawesome/free-brands-svg-icons"
import {
    Button,
    createStyles,
    Divider,
    Grid,
    Theme,
    Typography,
    WithStyles,
    withStyles,
    withWidth
} from "@material-ui/core"
import {GridProps} from "@material-ui/core/Grid"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import CloudUpload from "@material-ui/icons/CloudUpload"
import * as React from "react"
import {connect} from "react-redux"
import {Link} from "react-router-dom"
import {Dispatch} from "redux"
import {PLAYER_PAGE_LINK, STEAM_LOGIN_LINK, UPLOAD_LINK} from "../../Globals"
import {LoggedInUserActions, StoreState} from "../../Redux"
import {getLoggedInUser, getReplayCount} from "../../Requests/Global"
import {HomePageAppBar} from "../Home/HomePageAppBar"
import {HomePageFooter} from "../Home/HomePageFooter"
import {LinkButton} from "../Shared/LinkButton"
import {Logo} from "../Shared/Logo/Logo"
import {Search} from "../Shared/Search"
import {SideBar} from "../Shared/SideBar"
import {UploadDialogWrapper} from "../Shared/Upload/UploadDialogWrapper"

const styles = (theme: Theme) =>
    createStyles({
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
            minHeight: "100vh",
            display: "flex",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            backgroundImage: theme.palette.type === "dark" ? 'url("/splash_black.png")' : 'url("/splash.png")'
        }
    })

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setLoggedInUser: (loggedInUser: LoggedInUser) => dispatch(LoggedInUserActions.setLoggedInUserAction(loggedInUser))
})

type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    WithStyles<typeof styles> &
    WithWidth

interface State {
    replayCount?: number
    sideBarOpen: boolean
}

class HomePageComponent extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props)
        this.state = {sideBarOpen: false}
    }

    public componentDidMount() {
        getReplayCount().then((replayCount: number) => this.setState({replayCount}))
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
                        <SideBar open={this.state.sideBarOpen} onClose={this.toggleSideBar} />
                        <HomePageAppBar toggleSideBar={this.toggleSideBar} />
                        <Grid
                            container
                            justify="center"
                            alignItems="flex-start"
                            spacing={5}
                            className={classes.child}
                            style={{marginTop: 100}}
                        >
                            <Grid item xs={12} {...alignCenterProps}>
                                <Logo imgStyle={{maxWidth: "80vw", maxHeight: 88}} />
                            </Grid>
                            <Grid item xs={11} {...alignCenterProps} style={{padding: "20px 0 20px 0"}}>
                                <Search usePaper />
                            </Grid>
                            <Grid item xs={12} {...alignCenterProps} style={{padding: 15}} direction="column">
                                <Typography>
                                    <i>
                                        {this.state.replayCount
                                            ? `${this.state.replayCount} replays and counting...`
                                            : "Loading replay count..."}
                                    </i>
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={10}
                                md={8}
                                container
                                spacing={2}
                                alignItems="center"
                                style={{maxWidth: 550}}
                            >
                                <Grid item xs={6} style={{textAlign: "center"}}>
                                    {loggedInUser ? (
                                        <Link to={PLAYER_PAGE_LINK(loggedInUser.id)} style={{textDecoration: "none"}}>
                                            <Button variant="outlined">
                                                <img
                                                    src={loggedInUser.avatarLink}
                                                    alt="Avatar"
                                                    style={{marginRight: 8, height: 24, width: 24}}
                                                />
                                                View Profile
                                            </Button>
                                        </Link>
                                    ) : (
                                        <LinkButton
                                            to={STEAM_LOGIN_LINK}
                                            isExternalLink
                                            iconType="fontawesome"
                                            icon={faSteam}
                                        >
                                            {isWidthUp("sm", width) ? "Log in with Steam" : "Log in"}
                                        </LinkButton>
                                    )}
                                </Grid>
                                <Grid item xs={6} style={{textAlign: "center"}}>
                                    <LinkButton to={UPLOAD_LINK} iconType="mui" icon={CloudUpload}>
                                        Upload replays
                                    </LinkButton>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sm={8} md={8} lg={6} xl={4}>
                                <HomePageFooter />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            {isWidthUp("md", this.props.width) ? (
                                <>
                                    <Grid item container xs={12} sm={6} lg={4}>
                                        {/*<Twitch cardStyle={{width: "100%"}} />*/}
                                    </Grid>

                                    <Grid item container xs={12} sm={6} lg={4}>
                                        {/*<Recent cardStyle={{width: "100%"}} />*/}
                                    </Grid>
                                    <Grid item container xs={12} sm={6} lg={4}>
                                        {/*<Leaderboards cardStyle={{width: "100%"}} />*/}
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid item container xs={12} sm={6} lg={4}>
                                        {/*<Recent cardStyle={{width: "100%"}} />*/}
                                    </Grid>
                                    <Grid item container xs={12} sm={6} lg={4}>
                                        {/*<Leaderboards cardStyle={{width: "100%"}} />*/}
                                    </Grid>
                                    <Grid item container xs={12} sm={6} lg={4}>
                                        {/*<Twitch cardStyle={{width: "100%"}} />*/}
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </div>
                </UploadDialogWrapper>
            </div>
        )
    }

    private readonly toggleSideBar = () => {
        this.setState({sideBarOpen: !this.state.sideBarOpen})
    }
}

export const HomePage = withWidth()(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(HomePageComponent)))

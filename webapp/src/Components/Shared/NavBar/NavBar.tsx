import { faGlobeAmericas } from "@fortawesome/free-solid-svg-icons"
import { faLightbulb } from "@fortawesome/free-solid-svg-icons/faLightbulb"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    AppBar,
    createStyles,
    Grid,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    withStyles,
    WithStyles,
    withWidth
} from "@material-ui/core"
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import Menu from "@material-ui/icons/Menu"
import * as React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { Dispatch } from "redux"
import { ThemeContext } from "../../../Contexts/ThemeContext"
import { GLOBAL_STATS_LINK } from "../../../Globals"
import { LoggedInUserActions, StoreState } from "../../../Redux"
import { getLoggedInUser } from "../../../Requests/Global"
import { Logo } from "../Logo/Logo"
import { Search } from "../Search"
import { UploadDialogWrapper } from "../Upload/UploadDialogWrapper"
import { AccountMenu } from "./AccountMenu"

const styles = createStyles({
    grow: {
        flexGrow: 1
    },
    motto: {
        margin: "auto 0 auto 0"
    },
    search: {
        flexGrow: 1,
        minWidth: 200,
        maxWidth: 400
    },
    accountMenuGridItem: {
        margin: "auto",
        marginLeft: 10
    }
})

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setLoggedInUser: (loggedInUser: LoggedInUser) => dispatch(LoggedInUserActions.setLoggedInUserAction(loggedInUser))
})

interface OwnProps {
    toggleSideBar: () => void
}

type Props = ReturnType<typeof mapStateToProps>
    & ReturnType<typeof mapDispatchToProps>
    & WithWidth
    & WithStyles<typeof styles>
    & OwnProps

class NavBarComponent extends React.PureComponent<Props> {
    public componentDidMount() {
        getLoggedInUser()
            .then((loggedInUser) => this.props.setLoggedInUser(loggedInUser))
            .catch(() => undefined)
    }

    public render() {
        const {classes, width} = this.props
        return (
            <AppBar color="default">
                <Toolbar>
                    <Grid container>
                        <Grid item xs="auto">
                            <IconButton
                                onClick={this.props.toggleSideBar}
                                color="inherit"
                                aria-label="Menu"
                                style={{marginLeft: -12, marginRight: isWidthUp("sm", width) ? 10 : 0}}>
                                <Menu/>
                            </IconButton>
                        </Grid>
                        {isWidthUp("md", width) &&
                        <>
                            <Grid item xs="auto">
                                <Logo imgStyle={{maxHeight: 40}}/>
                            </Grid>
                            <Grid item xs="auto" className={classes.motto}>
                                <Typography align="center" style={{fontSize: 10, width: 100}}>
                                    a Rocket League statistics platform
                                </Typography>
                            </Grid>
                        </>
                        }

                        <Grid item xs="auto" className={classes.search}>
                            <Search usePaper={false}/>
                        </Grid>

                        {isWidthUp("sm", width) &&
                        <>
                            <Grid item className={classes.grow}/>
                            <Grid item>
                                <ThemeContext.Consumer>
                                    {(themeValue) => (
                                        <Tooltip title="Toggle theme">
                                            <IconButton onClick={themeValue.toggleTheme}>
                                                <FontAwesomeIcon icon={faLightbulb} style={{width: 24, height: 24}}/>
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </ThemeContext.Consumer>
                            </Grid>
                            <Grid item>
                                <Link to={GLOBAL_STATS_LINK}>
                                    <Tooltip title="Global stats">
                                        <IconButton><FontAwesomeIcon icon={faGlobeAmericas}/></IconButton>
                                    </Tooltip>
                                </Link>
                            </Grid>
                            <Grid item>
                                <UploadDialogWrapper buttonStyle="icon"/>
                            </Grid>
                            <Grid item xs="auto" className={classes.accountMenuGridItem}>
                                {/*TODO: Show AccountMenu even on mobile, but as a 3 dots icon.*/}
                                <AccountMenu loggedInUser={this.props.loggedInUser}/>
                            </Grid>
                        </>
                        }
                    </Grid>
                </Toolbar>
            </AppBar>
        )
    }
}

export const NavBar = withWidth()(withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(NavBarComponent)
))

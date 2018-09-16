import {faGlobeAmericas} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
    AppBar,
    createStyles,
    Grid,
    IconButton,
    Toolbar, Tooltip,
    Typography,
    withStyles,
    WithStyles,
    withWidth
} from "@material-ui/core"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {Link} from "react-router-dom"
import {GLOBAL_STATS_LINK} from "../../../Globals"
import {getLoggedInUser} from "../../../Requests/Global"
import {Logo} from "../Logo/Logo"
import {Search} from "../Search"
import {UploadModalWrapper} from "../Upload/UploadModalWrapper"
import {AccountMenu} from "./AccountMenu"

type Props = WithWidth
    & WithStyles<typeof styles>

interface State {
    loggedInUser?: LoggedInUser
}

class NavBarComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        getLoggedInUser()
            .then((loggedInUser) => this.setState({loggedInUser}))
            .catch()
    }

    public render() {
        const {classes, width} = this.props
        return (
            <AppBar color="default">
                <Toolbar>
                    <Grid container>
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
                                <Tooltip title="Global stats">
                                    <Link to={GLOBAL_STATS_LINK}>
                                        <IconButton><FontAwesomeIcon icon={faGlobeAmericas}/></IconButton>
                                    </Link>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <UploadModalWrapper buttonStyle="icon"/>
                            </Grid>
                        </>
                        }
                        <Grid item xs="auto" className={classes.accountMenuGridItem}>
                            <AccountMenu loggedInUser={this.state.loggedInUser}/>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        )
    }
}

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
        marginLeft: "10px"
    }
})

export const NavBar = withWidth()(withStyles(styles)(NavBarComponent))

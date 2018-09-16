import {AppBar, Grid, Toolbar, Typography, withWidth} from "@material-ui/core"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {getLoggedInUser} from "../../../Requests/Global"
import {Logo} from "../Logo/Logo"
import {Search} from "../Search"
import {UploadModalWrapper} from "../Upload/UploadModalWrapper"
import {AccountMenu} from "./AccountMenu"

type Props = WithWidth

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
        const searchStyle = {
            flexGrow: 1,
            minWidth: 300,
            maxWidth: 400
        }
        return (
            <AppBar color="default">
                <Toolbar>
                    <Grid container>
                        {isWidthUp("md", this.props.width) &&
                        <>
                            <Grid item xs="auto">
                                <Logo imgStyle={{maxHeight: 40}}/>
                            </Grid>
                            <Grid item xs="auto" style={{margin: "auto 0 auto 0"}}>
                                <Typography align="center" style={{fontSize: 10, width: 100}}>
                                    a Rocket League statistics platform
                                </Typography>
                            </Grid>
                        </>
                        }

                        <Grid item xs="auto" style={searchStyle}>
                            <Search usePaper={false}/>
                        </Grid>

                        {isWidthUp("sm", this.props.width) &&
                        <>
                            <Grid item style={{flexGrow: 1}}/>
                            <Grid item>
                                <UploadModalWrapper buttonStyle="icon"/>
                            </Grid>
                        </>
                        }
                        <Grid item xs="auto" style={{margin: "auto", marginLeft: "10px"}}>
                            <AccountMenu loggedInUser={this.state.loggedInUser}/>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        )
    }
}

export const NavBar = withWidth()(NavBarComponent)

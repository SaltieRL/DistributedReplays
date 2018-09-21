import {createStyles, WithStyles, withStyles} from "@material-ui/core"
import * as React from "react"
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom"
import {AboutPage} from "./Components/Pages/AboutPage"
import {GlobalStatsPage} from "./Components/Pages/GlobalStatsPage"
import {HomePage} from "./Components/Pages/HomePage"
import {PlayerPage} from "./Components/Pages/PlayerPage"
import {ReplayPage} from "./Components/Pages/ReplayPage"
import {UploadPage} from "./Components/Pages/UploadPage"
import {ReplayViewer} from "./Components/Replay/ReplayViewer/ReplayViewer"
import {GLOBAL_STATS_LINK, PLAYER_PAGE_LINK, REPLAY_PAGE_LINK} from "./Globals"

type Props = WithStyles<typeof styles>

class AppComponent extends React.Component<Props> {
    public render() {
        return (
            <div className={this.props.classes.App}>
                <BrowserRouter>
                    <Switch>
                        {/*Migrate old paths*/}
                        <Redirect exact from={"/players/overview/:id"} to={PLAYER_PAGE_LINK(":id")}/>
                        <Redirect exact from={"/replays/parsed/view/:id"} to={REPLAY_PAGE_LINK(":id")}/>

                        <Route exact path="/" component={HomePage}/>
                        <Route path={PLAYER_PAGE_LINK(":id")} component={PlayerPage}/>
                        <Route path={REPLAY_PAGE_LINK(":id")} component={ReplayPage}/>
                        <Route exact path="/replay_viewer" component={ReplayViewer}/>
                        <Route exact path="/about" component={AboutPage}/>
                        <Route exact path="/upload" component={UploadPage}/>
                        <Route exact path={GLOBAL_STATS_LINK} component={GlobalStatsPage}/>

                        {/*Redirect unknowns to root*/}
                        <Redirect from="*" to="/"/>
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

const styles = createStyles({
    App: {
        margin: "0",
        minHeight: "100vh",
        width: "100%",
        display: "flex"
    }
})

export const App = withStyles(styles)(AppComponent)

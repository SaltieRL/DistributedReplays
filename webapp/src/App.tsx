import * as React from "react"
import {BrowserRouter as Router, Route} from "react-router-dom"
import "./App.css"
import {AboutPage} from "./Components/Pages/AboutPage"
import {GlobalStatsPage} from "./Components/Pages/GlobalStatsPage"
import {HomePage} from "./Components/Pages/HomePage"
import {PlayerPage} from "./Components/Pages/PlayerPage"
import {ReplayPage} from "./Components/Pages/ReplayPage"
import {UploadPage} from "./Components/Pages/UploadPage"
import {ReplayViewer} from "./Components/Replay/ReplayViewer/ReplayViewer"
import {GLOBAL_STATS_LINK, PLAYER_PAGE_LINK, REPLAY_PAGE_LINK} from "./Globals"

export class App extends React.Component {
    public render() {
        return (
            <Router>
                <div className="App">
                    <Route exact={true} path="/" component={HomePage}/>
                    <Route path={PLAYER_PAGE_LINK(":id")} component={PlayerPage}/>
                    <Route exact={true} path={REPLAY_PAGE_LINK(":id")} component={ReplayPage}/>
                    <Route exact={true} path="/replay_viewer" component={ReplayViewer}/>
                    <Route exact={true} path="/about" component={AboutPage}/>
                    <Route exact={true} path="/upload" component={UploadPage}/>
                    <Route exact={true} path={GLOBAL_STATS_LINK} component={GlobalStatsPage}/>
                </div>
            </Router>
        )
    }
}

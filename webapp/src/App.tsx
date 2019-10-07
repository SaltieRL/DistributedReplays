import { createStyles, WithStyles, withStyles } from "@material-ui/core"
import * as React from "react"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import { AppListener } from "./AppListener"
import { AboutPage } from "./Components/Pages/AboutPage"
import { DocumentationPage } from "./Components/Pages/DocumentationPage"
import { ExplanationsPage } from "./Components/Pages/ExplanationsPage"
import { GlobalStatsPage } from "./Components/Pages/GlobalStatsPage"
import { HomePage } from "./Components/Pages/HomePage"
import { LeaderboardsPage } from "./Components/Pages/LeaderboardsPage"
import { PlayerComparePage } from "./Components/Pages/PlayerComparePage"
import { PlayerPage } from "./Components/Pages/PlayerPage"
import { PluginsPage } from "./Components/Pages/PluginsPage"
import { PrivacyPolicyPage } from "./Components/Pages/PrivacyPolicyPage"
import { ReplayPage } from "./Components/Pages/ReplayPage"
import { ReplaysGroupPage } from "./Components/Pages/ReplaysGroupPage"
import { ReplaysSearchPage } from "./Components/Pages/ReplaysSearchPage"
import { StatusPage } from "./Components/Pages/StatusPage"
import { TrainingPackPage } from "./Components/Pages/TrainingPackPage"
import { UploadPage } from "./Components/Pages/UploadPage"
import { Notifications } from "./Components/Shared/Notification/Notifications"
import {
    ABOUT_LINK, DOCUMENTATION_LINK,
    EXPLANATIONS_LINK,
    GLOBAL_STATS_LINK, LEADERBOARDS_LINK,
    PLAYER_COMPARE_PAGE_LINK,
    PLAYER_PAGE_LINK,
    PLUGINS_LINK, PRIVACY_POLICY_LINK,
    REPLAY_PAGE_LINK,
    REPLAYS_GROUP_PAGE_LINK,
    REPLAYS_SEARCH_PAGE_LINK,
    STATUS_PAGE_LINK, TRAINING_LINK,
    UPLOAD_LINK
} from "./Globals"

const styles = createStyles({
    App: {
        margin: 0,
        minHeight: "100vh",
        width: "100%",
        display: "flex"
    }
})

type Props = WithStyles<typeof styles>

class AppComponent extends React.Component<Props> {
    public render() {
        return (
            <div className={this.props.classes.App}>
                <BrowserRouter>
                    <AppListener>
                        <Switch>
                            {/*Migrate old paths*/}
                            <Redirect exact from={"/players/overview/:id"} to={PLAYER_PAGE_LINK(":id")}/>
                            <Redirect exact from={"/replays/parsed/view/:id"} to={REPLAY_PAGE_LINK(":id")}/>

                            <Route exact path="/" component={HomePage}/>
                            <Route path={TRAINING_LINK} component={TrainingPackPage}/>
                            <Route path={LEADERBOARDS_LINK} component={LeaderboardsPage}/>
                            <Route path={PLAYER_PAGE_LINK(":id")} component={PlayerPage}/>
                            <Route path={PLAYER_COMPARE_PAGE_LINK} component={PlayerComparePage}/>
                            <Route path={REPLAY_PAGE_LINK(":id")} component={ReplayPage}/>
                            <Route path={REPLAYS_GROUP_PAGE_LINK} component={ReplaysGroupPage}/>
                            <Route path={REPLAYS_SEARCH_PAGE_LINK()} component={ReplaysSearchPage}/>
                            <Route exact path={ABOUT_LINK} component={AboutPage}/>
                            <Route exact path={UPLOAD_LINK} component={UploadPage}/>
                            <Route exact path={GLOBAL_STATS_LINK} component={GlobalStatsPage}/>
                            <Route exact path={PLUGINS_LINK} component={PluginsPage}/>
                            <Route exact path={STATUS_PAGE_LINK} component={StatusPage}/>
                            <Route exact path={EXPLANATIONS_LINK} component={ExplanationsPage}/>
                            <Route exact path={DOCUMENTATION_LINK} component={DocumentationPage}/>
                            <Route exact path={PRIVACY_POLICY_LINK} component={PrivacyPolicyPage}/>
                            {/*Redirect unknowns to root*/}
                            <Redirect from="*" to="/"/>
                        </Switch>
                    </AppListener>
                </BrowserRouter>
                <Notifications/>
            </div>
        )
    }
}

export const App = withStyles(styles)(AppComponent)

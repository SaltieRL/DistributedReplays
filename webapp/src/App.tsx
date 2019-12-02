import {createStyles, WithStyles, withStyles} from "@material-ui/core"
import * as React from "react"
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom"

import {AppListener} from "./AppListener"
import {codeSplit} from "./CodeSplitComponent"
import {HomePage} from "./Components/Pages/HomePage"
import {PlayerPage} from "./Components/Pages/PlayerPage"
import {Notifications} from "./Components/Shared/Notification/Notifications"

import {
    ABOUT_LINK,
    ADMIN_LINK,
    DOCUMENTATION_LINK,
    EXPLANATIONS_LINK,
    GLOBAL_STATS_LINK,
    ITEMS_LINK,
    LEADERBOARDS_LINK,
    PLAYER_COMPARE_PAGE_LINK,
    PLAYER_PAGE_LINK,
    PLUGINS_LINK,
    PRIVACY_POLICY_LINK,
    REPLAY_PAGE_LINK,
    REPLAYS_GROUP_PAGE_LINK,
    REPLAYS_SEARCH_PAGE_LINK,
    STATUS_PAGE_LINK,
    TAGS_PAGE_LINK,
    TRAINING_LINK,
    UPLOAD_LINK
} from "./Globals"

const CodeSplitAboutPage = codeSplit(() => import("./Components/Pages/AboutPage"), "AboutPage")
const CodeSplitAdminPage = codeSplit(() => import("./Components/Pages/AdminPage"), "AdminPage")
const CodeSplitDocumentationPage = codeSplit(() => import("./Components/Pages/DocumentationPage"), "DocumentationPage")
const CodeSplitExplanationsPage = codeSplit(() => import("./Components/Pages/ExplanationsPage"), "ExplanationsPage")
const CodeSplitGlobalStatsPage = codeSplit(() => import("./Components/Pages/GlobalStatsPage"), "GlobalStatsPage")
const CodeSplitItemsStatsPage = codeSplit(() => import("./Components/Pages/ItemStatsPage"), "ItemStatsPage")
const CodeSplitLeaderboardsPage = codeSplit(() => import("./Components/Pages/LeaderboardsPage"), "LeaderboardsPage")
const CodeSplitPlayerComparePage = codeSplit(() => import("./Components/Pages/PlayerComparePage"), "PlayerComparePage")
const CodeSplitPluginsPage = codeSplit(() => import("./Components/Pages/PluginsPage"), "PluginsPage")
const CodeSplitPrivacyPolicyPage = codeSplit(() => import("./Components/Pages/PrivacyPolicyPage"), "PrivacyPolicyPage")
const CodeSplitReplayPage = codeSplit(() => import("./Components/Pages/ReplayPage"), "ReplayPage")
const CodeSplitReplaysGroupPage = codeSplit(() => import("./Components/Pages/ReplaysGroupPage"), "ReplaysGroupPage")
const CodeSplitReplaysSearchPage = codeSplit(() => import("./Components/Pages/ReplaysSearchPage"), "ReplaysSearchPage")
const CodeSplitStatusPage = codeSplit(() => import("./Components/Pages/StatusPage"), "StatusPage")
const CodeSplitTagsPage = codeSplit(() => import("./Components/Pages/TagsPage"), "TagsPage")
const CodeSplitTrainingPackPage = codeSplit(() => import("./Components/Pages/TrainingPackPage"), "TrainingPackPage")
const CodeSplitUploadPage = codeSplit(() => import("./Components/Pages/UploadPage"), "UploadPage")

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
                            <Redirect exact from={"/players/overview/:id"} to={PLAYER_PAGE_LINK(":id")} />
                            <Redirect exact from={"/replays/parsed/view/:id"} to={REPLAY_PAGE_LINK(":id")} />
                            <Route exact path="/" component={HomePage} />
                            <Route path={ADMIN_LINK} component={CodeSplitAdminPage} />
                            <Route path={ITEMS_LINK} component={CodeSplitItemsStatsPage} />
                            <Route path={TRAINING_LINK} component={CodeSplitTrainingPackPage} />
                            <Route path={LEADERBOARDS_LINK} component={CodeSplitLeaderboardsPage} />
                            <Route path={PLAYER_PAGE_LINK(":id")} component={PlayerPage} />
                            <Route path={PLAYER_COMPARE_PAGE_LINK} component={CodeSplitPlayerComparePage} />
                            <Route path={REPLAY_PAGE_LINK(":id")} component={CodeSplitReplayPage} />
                            <Route path={REPLAYS_GROUP_PAGE_LINK} component={CodeSplitReplaysGroupPage} />
                            <Route path={REPLAYS_SEARCH_PAGE_LINK()} component={CodeSplitReplaysSearchPage} />
                            <Route exact path={ABOUT_LINK} component={CodeSplitAboutPage} />
                            <Route exact path={UPLOAD_LINK} component={CodeSplitUploadPage} />
                            <Route exact path={GLOBAL_STATS_LINK} component={CodeSplitGlobalStatsPage} />
                            <Route exact path={PLUGINS_LINK} component={CodeSplitPluginsPage} />
                            <Route exact path={STATUS_PAGE_LINK} component={CodeSplitStatusPage} />
                            <Route exact path={EXPLANATIONS_LINK} component={CodeSplitExplanationsPage} />
                            <Route exact path={DOCUMENTATION_LINK} component={CodeSplitDocumentationPage} />
                            <Route exact path={PRIVACY_POLICY_LINK} component={CodeSplitPrivacyPolicyPage} />
                            <Route exact path={TAGS_PAGE_LINK} component={CodeSplitTagsPage} />
                            {/*Redirect unknowns to root*/}
                            <Redirect from="*" to="/" />
                        </Switch>
                    </AppListener>
                </BrowserRouter>
                <Notifications />
            </div>
        )
    }
}

export const App = withStyles(styles)(AppComponent)

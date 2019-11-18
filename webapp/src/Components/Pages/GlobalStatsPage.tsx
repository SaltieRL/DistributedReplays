import {Grid, Paper, Tab, Tabs, Typography} from "@material-ui/core"
import * as React from "react"
import {connect} from "react-redux"
import {StoreState} from "../../Redux"
import {getGlobalRankGraphs, getGlobalStats} from "../../Requests/Global"
import {convertSnakeAndCamelCaseToReadable} from "../../Utils/String"
import {GlobalStatsChart} from "../GlobalStatsChart"
import {GlobalStatsRankGraph} from "../GlobalStatsRankGraph"
import {IconTooltip} from "../Shared/IconTooltip"
import {LoadableWrapper} from "../Shared/LoadableWrapper"
import {BasePage} from "./BasePage"

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

type Props = ReturnType<typeof mapStateToProps>

type GlobalStatsTab = "Playlist Distribution" | "Rank Distribution"
const globalStatsTabs: GlobalStatsTab[] = ["Playlist Distribution", "Rank Distribution"]

interface State {
    globalStats?: GlobalStatsGraph[]
    globalRankGraphs?: any // TODO(Sciguymjm) Type this thing. Also add stat category to group by.
    selectedTab: GlobalStatsTab
}

export class GlobalStatsPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "Playlist Distribution"}
    }

    public render() {
        const removedStats = ["first_frame_in_game", "is_keyboard", "time_in_game", "total_saves"]
        return (
            <BasePage useSplash>
                <Grid container spacing={2} alignItems="center" justify="center">
                    <Grid item xs={12}>
                        <Typography variant="h3" align="center">
                            Distributions
                            <IconTooltip tooltip="Click legend items to toggle visibility of that playlist" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <Tabs value={this.state.selectedTab} onChange={this.handleTabChange} centered>
                                {globalStatsTabs.map((tab) => (
                                    <Tab label={tab} value={tab} key={tab} />
                                ))}
                            </Tabs>
                            <Grid container spacing={2} style={{paddingTop: 16}}>
                                {this.state.selectedTab === "Playlist Distribution" && (
                                    <LoadableWrapper load={this.getStats}>
                                        {this.state.globalStats &&
                                            this.state.globalStats.map((globalStatsGraph) => {
                                                return (
                                                    <Grid item xs={12} sm={6} md={4} key={globalStatsGraph.name}>
                                                        <Typography variant="h6" align="center">
                                                            {globalStatsGraph.name}
                                                        </Typography>
                                                        <GlobalStatsChart graph={globalStatsGraph} />
                                                    </Grid>
                                                )
                                            })}
                                    </LoadableWrapper>
                                )}
                                {this.state.selectedTab === "Rank Distribution" && (
                                    <LoadableWrapper load={this.getRankGraphs}>
                                        {this.state.globalRankGraphs &&
                                            Object.keys(this.state.globalRankGraphs["13"]).map((key: any) => {
                                                // TODO(Sciguymjm) Type this thing.
                                                const globalStatsGraph = this.state.globalRankGraphs["13"][key]
                                                if (removedStats.includes(key)) {
                                                    return null
                                                }
                                                return (
                                                    <Grid item xs={12} sm={6} md={4} key={key}>
                                                        <Typography variant="h6" align="center">
                                                            {convertSnakeAndCamelCaseToReadable(key)}
                                                        </Typography>
                                                        <GlobalStatsRankGraph graph={globalStatsGraph} />
                                                    </Grid>
                                                )
                                            })}
                                    </LoadableWrapper>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }

    private readonly getStats = (): Promise<void> => {
        return getGlobalStats().then((globalStats) => this.setState({globalStats}))
    }

    private readonly getRankGraphs = (): Promise<void> => {
        return getGlobalRankGraphs().then((stats) => this.setState({globalRankGraphs: stats}))
    }

    private readonly handleTabChange = (event: React.ChangeEvent<{}>, value: GlobalStatsTab): void => {
        this.setState({selectedTab: value})
    }
}

export const GlobalStatsPage = connect(mapStateToProps)(GlobalStatsPageComponent)

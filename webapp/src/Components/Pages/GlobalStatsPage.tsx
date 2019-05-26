import { Card, CardContent, CardHeader, Grid, Typography } from "@material-ui/core"
import * as React from "react"
import { connect } from "react-redux"
import { StoreState } from "../../Redux"
import { getGlobalRankGraphs, getGlobalStats } from "../../Requests/Global"
import { GlobalStatsChart } from "../GlobalStatsChart"
import { GlobalStatsRankGraph } from "../GlobalStatsRankGraph"
import { IconTooltip } from "../Shared/IconTooltip"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

type Props = ReturnType<typeof mapStateToProps>

interface State {
    globalStats?: GlobalStatsGraph[]
    globalRankGraphs?: any
}

export class GlobalStatsPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public render() {
        const removedStats = ["first_frame_in_game", "is_keyboard", "time_in_game", "total_saves"]
        return (
            <BasePage backgroundImage={"/splash.png"}>
                <Grid container spacing={16} alignItems="center" justify="center">
                    <Grid item xs={12}>
                        <Typography variant="title" align="center">
                            Distributions
                            <IconTooltip tooltip="Click legend items to toggle visibility of that playlist"/>
                        </Typography>
                    </Grid>
                    <LoadableWrapper load={this.getStats}>
                        {this.state.globalStats && this.state.globalStats.map((globalStatsGraph) => {
                            return (
                                <Grid item xs={12} sm={6} md={4} key={globalStatsGraph.name}>
                                    <Card>
                                        <CardHeader title={globalStatsGraph.name}
                                                    titleTypographyProps={{align: "center"}}/>
                                        <CardContent>
                                            <GlobalStatsChart graph={globalStatsGraph}/>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </LoadableWrapper>
                    <LoadableWrapper load={this.getRankGraphs}>
                        {this.state.globalRankGraphs && Object.keys(this.state.globalRankGraphs["13"])
                            .map((key: any) => {
                                const globalStatsGraph = this.state.globalRankGraphs["13"][key]
                                if (removedStats.indexOf(key) !== -1) {
                                    return null
                                }
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={key}>
                                        <Card>
                                            <CardHeader title={this.titleCase(key.replace(/_/g, " "))}
                                                        titleTypographyProps={{align: "center"}}/>
                                            <CardContent>
                                                <GlobalStatsRankGraph graph={globalStatsGraph}/>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )
                            })}
                    </LoadableWrapper>
                </Grid>
            </BasePage>
        )
    }

    private readonly getStats = (): Promise<void> => {
        return getGlobalStats()
            .then((globalStats) => this.setState({globalStats}))
    }

    private readonly getRankGraphs = (): Promise<void> => {
        return getGlobalRankGraphs()
            .then((stats) => this.setState({globalRankGraphs: stats}))
    }

    private titleCase(str: string) { // TODO: Look at if this is similar to convertSnakeAndCamelCaseToReadable
        return str.toLowerCase().split(" ").map((word) => word.replace(word[0],
            word[0].toUpperCase())).join(" ")
    }
}

export const GlobalStatsPage = connect(mapStateToProps)(GlobalStatsPageComponent)

import { Card, CardContent, CardHeader, Grid, Typography } from "@material-ui/core"
import * as React from "react"
import { getGlobalRankGraphs, getGlobalStats } from "../../Requests/Global"
import { GlobalStatsChart } from "../GlobalStatsChart"
import { IconTooltip } from "../Shared/IconTooltip"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"
import { GlobalStatsRankGraph } from "../GlobalStatsRankGraph"

interface State {
    globalStats?: GlobalStatsGraph[]
    globalRankGraphs?: any
}

export class GlobalStatsPage extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {}
    }

    public render() {
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
                        {this.state.globalRankGraphs && Object.keys(this.state.globalRankGraphs["13"]).map((key: any) => {
                            const globalStatsGraph = this.state.globalRankGraphs["13"][key];
                            return (
                                <Grid item xs={12} sm={6} md={4} key={key}>
                                    <Card>
                                        <CardHeader title={key}
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
}

import { Grid, Typography } from "@material-ui/core"
import * as React from "react"
import { BasicStat, Replay, TeamStatsSubcategory } from "../../../../Models"
import { getReplayTeamStats } from "../../../../Requests/Replay"
import { convertSnakeAndCamelCaseToReadable } from "../../../../Utils/String"
import { StatChart } from "../../../Shared/Charts/StatChart"
import { LoadableWrapper } from "../../../Shared/LoadableWrapper"

interface Props {
    replay: Replay
    selectedTab: TeamStatsSubcategory
    explanations: Record<string, any> | undefined
}

interface State {
    basicStats: BasicStat[]
}

export class TeamStatsCharts extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {basicStats: []}
    }

    public render() {
        const {selectedTab} = this.props
        const {basicStats} = this.state

        const basicStatsForSelectedTab: BasicStat[] = basicStats ?
            basicStats
                .filter((basicStat) => basicStat.subcategory === selectedTab)
            : []

        return (
            <LoadableWrapper load={this.getTeamStats}>
                {basicStatsForSelectedTab.length > 0 ?
                    basicStatsForSelectedTab
                        .map((basicStat) => {
                            return (
                                <Grid item xs={12} md={6} lg={4} xl={3} key={basicStat.title}>
                                    <Typography variant="subheading" align="center">
                                        {convertSnakeAndCamelCaseToReadable(basicStat.title)}
                                    </Typography>
                                    <StatChart basicStat={basicStat} explanations={this.props.explanations}/>
                                </Grid>
                            )
                        })
                    :
                    <Grid item xs={12}>
                        <Typography align="center" style={{width: "100%"}}>
                            These stats have not yet been calculated for this replay
                        </Typography>
                    </Grid>
                }
            </LoadableWrapper>
        )
    }

    private readonly getTeamStats = (): Promise<any> => {
        return getReplayTeamStats(this.props.replay.id)
            .then((basicStats) => this.setState({basicStats}))
    }
}

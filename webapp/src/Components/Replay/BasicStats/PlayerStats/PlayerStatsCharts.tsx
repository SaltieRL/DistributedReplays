import { Grid, Typography } from "@material-ui/core"
import * as React from "react"
import { BasicStat, PlayerStatsSubcategory, Replay } from "../../../../Models"
import { getReplayPlayerStats } from "../../../../Requests/Replay"
import { convertSnakeAndCamelCaseToReadable } from "../../../../Utils/String"
import { StatChart } from "../../../Shared/Charts/StatChart"
import { LoadableWrapper } from "../../../Shared/LoadableWrapper"

interface Props {
    replay: Replay
    selectedTab: PlayerStatsSubcategory
    explanations: Record<string, any> | undefined
}

interface State {
    playerStats: BasicStat[]
}

export class PlayerStatsCharts extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {playerStats: []}
    }

    public render() {
        const {selectedTab} = this.props
        const {playerStats} = this.state

        const playerStatsForSelectedTab: BasicStat[] = playerStats ?
            playerStats
                .filter((playerStat) => playerStat.subcategory === selectedTab)
            : []

        return (
            <LoadableWrapper load={this.getPlayerStats}>
                {playerStatsForSelectedTab.length > 0 ?
                    playerStatsForSelectedTab
                        .map((playerStat) => {
                            return (
                                <Grid item xs={12} md={6} lg={4} xl={3} key={playerStat.title}>
                                    <Typography variant="subheading" align="center">
                                        {convertSnakeAndCamelCaseToReadable(playerStat.title)}
                                    </Typography>
                                    <StatChart basicStat={playerStat} explanations={this.props.explanations}/>
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

    private readonly getPlayerStats = (): Promise<any> => {
        return getReplayPlayerStats(this.props.replay.id)
            .then((playerStats) => this.setState({playerStats}))
    }
}

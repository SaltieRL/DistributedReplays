import { Grid, Typography } from "@material-ui/core"
import * as React from "react"
import { BasicStat, PlayerStatsSubcategory, Replay } from "../../../Models"
import { getReplayGroupStats } from "../../../Requests/Replay"
import { convertSnakeAndCamelCaseToReadable } from "../../../Utils/String"
import { StatChart } from "../../Shared/Charts/StatChart"
import { LoadableWrapper } from "../../Shared/LoadableWrapper"

interface Props {
    replays: Replay[]
    selectedTab: PlayerStatsSubcategory
}

interface State {
    basicStats: BasicStat[]
    reloadSignal: boolean
}

export class ReplaysGroupCharts extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {basicStats: [], reloadSignal: false}
    }

    public componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.replays !== this.props.replays && prevProps.replays.length !== 0) {
            this.triggerReload()
        }
    }

    public render() {
        const {selectedTab} = this.props
        const {basicStats} = this.state

        const basicStatsForSelectedTab: BasicStat[] = basicStats ?
            basicStats
                .filter((basicStat) => basicStat.subcategory === selectedTab)
            : []

        return (
            <>
                {this.props.replays.length !== 0 ?
                    <LoadableWrapper load={this.getStatsForReplays} reloadSignal={this.state.reloadSignal}>
                        {basicStatsForSelectedTab.length > 0 ?
                            basicStatsForSelectedTab
                                .map((basicStat) => {
                                    return (
                                        <Grid item xs={12} md={6} lg={4} xl={3} key={basicStat.title}>
                                            <Typography variant="subheading" align="center">
                                                {convertSnakeAndCamelCaseToReadable(basicStat.title)}
                                            </Typography>
                                            <StatChart basicStat={basicStat} explanations={{}}/>
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
                    :
                    <Typography>
                        No replay selected
                    </Typography>
                }
            </>
        )
    }

    private readonly getStatsForReplays = () => {
        return getReplayGroupStats(this.props.replays.map((replay) => replay.id))
            .then((basicStats) => this.setState({basicStats}))
    }

    private readonly triggerReload = () => {
        this.setState({reloadSignal: !this.state.reloadSignal})
    }
}

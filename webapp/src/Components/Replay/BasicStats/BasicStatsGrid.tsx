import {Grid, Typography} from "@material-ui/core"
import * as React from "react"
import {BasicStat} from "../../../Models/ChartData"
import {Replay} from "../../../Models/Replay/Replay"
import {getReplayBasicStats} from "../../../Requests/Replay"
import {StatChart} from "../../Shared/Charts/StatChart"

interface Props {
    replay: Replay
}

interface State {
    basicStats?: BasicStat[]
}

export class BasicStatsGrid extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        getReplayBasicStats(this.props.replay.id)
            .then((basicStats) => this.setState({basicStats}))
    }

    public render() {
        return (
            <>
                {this.state.basicStats &&
                <Grid container spacing={32}>
                    {this.state.basicStats.map((basicStat) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} xl={3} key={basicStat.title}>
                                <Typography variant="subheading" align="center">
                                    {basicStat.title}
                                </Typography>
                                <StatChart basicStat={basicStat}/>
                            </Grid>
                        )
                    })}
                </Grid>
                }
            </>
        )
    }
}

import {Grid, Typography} from "@material-ui/core"
import * as React from "react"
import {BasicStat} from "../../../Models/ChartData"
import {Replay} from "../../../Models/Replay/Replay"
import {getReplayBasicStats} from "../../../Requests/Replay"
import {convertSnakeAndCamelCaseToReadable} from "../../../Utils/String"
import {StatChart} from "../../Shared/Charts/StatChart"
import {LoadableWrapper} from "../../Shared/LoadableWrapper"

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

    public render() {
        return (
            <Grid container spacing={32}>
                <LoadableWrapper load={this.getBasicStats}>
                    {this.state.basicStats &&
                    this.state.basicStats.map((basicStat) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} xl={3} key={basicStat.title}>
                                <Typography variant="subheading" align="center">
                                    {convertSnakeAndCamelCaseToReadable(basicStat.title)}
                                </Typography>
                                <StatChart basicStat={basicStat}/>
                            </Grid>
                        )
                    })}
                </LoadableWrapper>
            </Grid>
        )
    }

    private readonly getBasicStats = (): Promise<any> => {
        return getReplayBasicStats(this.props.replay.id)
            .then((basicStats) => this.setState({basicStats}))
    }
}

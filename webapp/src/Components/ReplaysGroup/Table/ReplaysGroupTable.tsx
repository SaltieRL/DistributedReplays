import { Grid, Typography } from "@material-ui/core"
import * as React from "react"
import { BasicStat, Replay } from "../../../Models"
import { getReplayGroupStats } from "../../../Requests/Replay"
import { LoadableWrapper } from "../../Shared/LoadableWrapper"
import { BasicStatsTable } from "./BasicStatsTable"

interface Props {
    replays: Replay[]
}

interface State {
    basicStats: BasicStat[]
    reloadSignal: boolean
}

export class ReplaysGroupTable extends React.PureComponent<Props, State> {
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
        return (
            <>
                {this.props.replays.length !== 0 ?
                    // TODO: Make LoadableWrapper be shared with ReplayDetailsCharts.
                    // It currently reloads on tab-change.
                    <LoadableWrapper load={this.getStatsForReplays} reloadSignal={this.state.reloadSignal}>
                        {this.state.basicStats.length > 0 ?
                            <div style={{overflowX: "auto"}}>
                                <BasicStatsTable basicStats={this.state.basicStats}/>
                            </div>
                            :
                            <Grid item xs={12}>
                                <Typography align="center" style={{width: "100%"}}>
                                    These stats have not yet been calculated for this replay
                                </Typography>
                            </Grid>
                        }
                    </LoadableWrapper>
                    :
                    <Typography align="center" gutterBottom>
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

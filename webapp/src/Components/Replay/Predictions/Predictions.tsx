import { CardContent, Divider, Grid } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import * as React from "react"
import { Replay } from "../../../Models"
import { getPredictedRanks } from "../../../Requests/Replay"
import { LoadableWrapper } from "../../Shared/LoadableWrapper"
import { PredictedRanksTable } from "./PredictedRanksTable"

interface Props {
    replay: Replay
}

interface State {
    predictedRanks?: PredictedRank[]
}

export class Predictions extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public render() {
        return (
            <>
                <Divider/>
                <CardContent>
                    <Grid container spacing={32} justify="center">
                        <LoadableWrapper load={this.getPredictedRanks}>
                            {this.state.predictedRanks ?
                                <Grid item xs="auto" style={{overflowX: "auto"}}>
                                    <PredictedRanksTable predictedRanks={this.state.predictedRanks}
                                                         replay={this.props.replay}/>
                                </Grid>
                                :
                                <Grid item xs={12}>
                                    <Typography>No predictions for this playlist are available.</Typography>}
                                </Grid>
                            }
                        </LoadableWrapper>
                    </Grid>
                </CardContent>
            </>
        )
    }

    private readonly getPredictedRanks = (): Promise<void> => {
        return getPredictedRanks(this.props.replay.id)
            .then((predictedRanks) => this.setState({predictedRanks}))
    }
}

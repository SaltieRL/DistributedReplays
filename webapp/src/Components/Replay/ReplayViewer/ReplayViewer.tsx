import {Grid, Typography} from "@material-ui/core"
import * as React from "react"
import {getReplayViewerData} from "../../../Requests/Replay"
import {ThreeScene} from "./ThreeScene"
import {Replay} from "../../../Models/Replay/Replay";

interface OwnProps {
    replay: Replay
}

type Props = OwnProps

interface State {
    replayData?: any
}

export class ReplayViewer extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        this.getReplayPositions()
    }

    public render() {
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Typography>
                        Replay Viewer
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {this.state.replayData &&
                    <ThreeScene replayData={this.state.replayData}/>}
                </Grid>
            </Grid>
        )
    }

    public getReplayPositions = () => {
        getReplayViewerData(this.props.replay.id)
            .then((data: any) => this.setState({replayData: data}))
    }
}

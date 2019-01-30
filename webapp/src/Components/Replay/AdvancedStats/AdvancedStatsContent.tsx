import Grid from "@material-ui/core/Grid"
import * as React from "react"
import { Replay } from "src/Models"
import { getHeatmaps } from "../../../Requests/Replay"
import { LoadableWrapper } from "../../Shared/LoadableWrapper"
import { ReactHeatmap } from "./Heatmap"
import Typography from "@material-ui/core/Typography"

interface Props {
    replay: Replay
}

interface State {
    heatmapData: any
    heatmap: any
}

export class AdvancedStatsContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {heatmapData: null, heatmap: null}
    }

    // public componentDidMount() {
    //     const config = {container: ReactDOM.findDOMNode(this) as HTMLElement}
    //     const heatmap = h337.create(config)
    //     this.setState({heatmap})
    // }

    public render() {
        const {replay} = this.props
        const blueTeam =
            replay.players.filter((player) => !player.isOrange)
        const orangeTeam =
            replay.players.filter((player) => player.isOrange)

        return (
            <Grid container>
                    <LoadableWrapper load={this.getHeatmapsData}>
                        {this.state.heatmapData !== null ?
                            blueTeam.map((player) =>
                                <Grid item key={player.name} xs={12} style={{height: "500px"}}>
                                    <Typography>{player.name}</Typography>
                                    <ReactHeatmap data={{
                                    max: this.state.heatmapData.maxs[player.name],
                                    // max: 1,
                                    data: this.state.heatmapData.data[player.name]
                                }}
                                              style={{width: "500px", height: "500px"}}
                                              config={{
                                                  radius: 22
                                              }}/>
                                </Grid>) : undefined}
                                {this.state.heatmapData !== null ?
                            orangeTeam.map((player) =>
                                <Grid item key={player.name} xs={12} style={{height: "500px"}}>
                                    <Typography>{player.name}</Typography>
                                    <ReactHeatmap data={{
                                    max: this.state.heatmapData.maxs[player.name],
                                    // max: 1,
                                    data: this.state.heatmapData.data[player.name]
                                }}
                                              style={{width: "500px", height: "500px"}}
                                              config={{
                                                  radius: 22
                                              }}/>
                                </Grid>) : undefined}
                    </LoadableWrapper>
            </Grid>
        )

    }

    private readonly getHeatmapsData = () => {
        return getHeatmaps(this.props.replay.id)
            .then((data) => this.setState({heatmapData: data}))
    }
}

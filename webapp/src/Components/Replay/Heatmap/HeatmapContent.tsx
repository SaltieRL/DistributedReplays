import * as React from "react"
import { ReactHeatmap } from "./Heatmap"
import { Replay } from "../../../Models"
import { Grid, Typography } from "@material-ui/core"

interface Props {
    replay: Replay
    heatmapData: any
}

interface State {

}

export class HeatmapContent extends React.PureComponent<Props, State> {
    public render() {
        const {replay} = this.props
        const blueTeam =
            replay.players.filter((player) => !player.isOrange)
        const orangeTeam =
            replay.players.filter((player) => player.isOrange)
        return (
            <Grid container justify={"center"}>
                <Grid item xs={6} style={{textAlign: "center"}}>
                    <Typography variant={"h3"}>Blue</Typography>
                    {this.props.heatmapData !== null ?
                        blueTeam.map((player) =>
                            <Grid item key={player.name} xs={12} style={{height: "500px"}}>
                                <Typography>{player.name}</Typography>
                                <ReactHeatmap data={{
                                    max: this.props.heatmapData.maxs[player.name],
                                    // max: 1,
                                    data: this.props.heatmapData.data[player.name]
                                }}
                                              style={{width: "500px", height: "500px", display: "block"}}
                                              config={{
                                                  radius: 22
                                              }}/>
                            </Grid>) : undefined}
                </Grid>
                <Grid item xs={6} style={{textAlign: "center"}}>
                    <Typography variant={"h3"}>Orange</Typography>
                    {this.props.heatmapData !== null ?
                        orangeTeam.map((player) =>
                            <Grid item key={player.name} xs={12} style={{height: "500px"}}>
                                <Typography>{player.name}</Typography>
                                <ReactHeatmap
                                    data={{
                                        max: this.props.heatmapData.maxs[player.name],
                                        // max: 1,
                                        data: this.props.heatmapData.data[player.name]
                                    }}
                                    style={{width: "500px", height: "500px"}}
                                    config={{
                                        radius: 22
                                    }}/>
                            </Grid>) : undefined}
                </Grid>
                <Grid item xs={12} style={{textAlign: "center"}}>
                    {(this.props.heatmapData !== null && "ball" in this.props.heatmapData.data) ?
                        <Grid item xs={12} style={{height: "500px"}}>
                            <Typography variant={"h3"}>Ball</Typography>
                            <ReactHeatmap
                                data={{
                                    max: this.props.heatmapData.maxs.ball,
                                    // max: 1,
                                    data: this.props.heatmapData.data.ball
                                }}
                                style={{width: "500px", height: "500px"}}
                                config={{
                                    radius: 22
                                }}/>
                        </Grid>
                        : undefined}
                </Grid>
            </Grid>
        )
    }
}

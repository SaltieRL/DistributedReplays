import { Grid, Typography } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models"
import { ReactHeatmap } from "./Heatmap"

interface Props {
    replay: Replay
    heatmapData: any
}

interface State {

}

const WIDTH = "250px"
const HEIGHT = "350px"

export class HeatmapContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.createHeatmap = this.createHeatmap.bind(this)
    }

    public render() {
        const {replay} = this.props
        const blueTeam =
            replay.players.filter((player) => !player.isOrange)
        const orangeTeam =
            replay.players.filter((player) => player.isOrange)
        blueTeam.sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()
            if (nameA < nameB) {
                return -1
            }
            if (nameA > nameB) {
                return 1
            }
            return 0
        })
        orangeTeam.sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()
            if (nameA < nameB) {
                return -1
            }
            if (nameA > nameB) {
                return 1
            }
            return 0
        })
        return (
            <Grid container justify={"center"}>
                <Grid item xs={6} style={{textAlign: "center"}}>
                    <Typography variant={"h3"}>Blue</Typography>
                    <Grid container>
                        {this.props.heatmapData !== null ?
                            blueTeam.map(this.createHeatmap) : undefined}
                    </Grid>
                </Grid>
                <Grid item xs={6} style={{textAlign: "center"}}>
                    <Typography variant={"h3"}>Orange</Typography>
                    <Grid container>
                        {this.props.heatmapData !== null ?
                            orangeTeam.map(this.createHeatmap) : undefined}
                    </Grid>
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
                                style={{width: WIDTH, height: HEIGHT}}
                                config={{
                                    radius: 18
                                }}/>
                        </Grid>
                        : undefined}
                </Grid>
            </Grid>
        )
    }

    private createHeatmap(player: any) {
        return (
            <Grid item key={player.name} xs={12} md={6} lg={4} style={{height: "375px", width: WIDTH}}>
                <Typography>{player.name}</Typography>
                <ReactHeatmap data={{
                    max: this.props.heatmapData.maxs[player.name],
                    // max: 1,
                    data: this.props.heatmapData.data[player.name]
                }}
                              style={{width: WIDTH, height: HEIGHT}}
                              config={{
                                  radius: 18
                              }}/>
            </Grid>
        )
    }
}

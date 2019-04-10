import { Grid, Typography } from "@material-ui/core"
import * as React from "react"
import { Scatter } from "react-chartjs-2"
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

export class HitsContent extends React.PureComponent<Props, State> {
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
        const data = this.props.heatmapData.data[player.name]
        return (
            <Grid item key={player.name} xs={12} md={6} lg={6} style={{
                width: "400px",
                height: "500px"
            }}>
                <Typography>{player.name}</Typography>
                <Scatter data={{
                    datasets: [
                        {
                            label: player.name,
                            data: data.map((point: any) => {
                                return {
                                    x: point.x,
                                    y: point.y
                                }
                            })
                        }
                    ]
                }}
                         options={{
                             responsive: true,
                             maintainAspectRatio: false,
                             scales: {
                                 xAxes: [{
                                     ticks: {
                                         min: 0,
                                         max: 500
                                     }
                                 }],
                                 yAxes: [{
                                     ticks: {
                                         min: 0,
                                         max: 500
                                     }
                                 }]
                             }
                         }}/>
            </Grid>
        )
    }
}

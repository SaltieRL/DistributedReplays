import { createStyles, Grid, Typography, WithStyles, withStyles } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models"
import { ReactHeatmap } from "./Heatmap"

const styles = createStyles({
    heatmapTitle: {
        padding: 10,
        marginBottom: 10
    }
})

interface OwnProps {
    replay: Replay
    heatmapData: any
}

type Props = OwnProps
    & WithStyles<typeof styles>

const WIDTH = 250
const HEIGHT = 350

class HeatmapContentComponent extends React.PureComponent<Props> {
    public render() {
        const {replay, classes} = this.props
        const blueTeam = replay.players.filter((player) => !player.isOrange)
        const orangeTeam = replay.players.filter((player) => player.isOrange)
        blueTeam.sort(this.nameCompareFn)
        orangeTeam.sort(this.nameCompareFn)
        return (
            <Grid container justify={"center"}>
                <Grid item xs={6} style={{textAlign: "center", borderRight: "#ccc solid 2px"}}>
                    <Typography variant="h5" style={{borderBottom: "blue solid 1px"}}
                                className={classes.heatmapTitle}>Blue</Typography>
                    <Grid container justify="space-evenly">
                        {this.props.heatmapData !== null && blueTeam.map(this.createHeatmap)}
                    </Grid>
                </Grid>
                <Grid item xs={6} style={{textAlign: "center"}}>
                    <Typography
                        variant="h5"
                        style={{borderBottom: "orange solid 1px"}}
                        className={classes.heatmapTitle}>
                        Orange
                    </Typography>
                    <Grid container justify="space-evenly">
                        {this.props.heatmapData !== null && orangeTeam.map(this.createHeatmap)}
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{textAlign: "center"}}>
                    {(this.props.heatmapData !== null && "ball" in this.props.heatmapData.data) && (
                        <Grid item xs={12} style={{height: "500px"}}>
                            <Typography variant="h3">Ball</Typography>
                            <div style={{
                                background: `url(/fieldrblack.png) no-repeat center`,
                                backgroundSize: "250px 350px",
                                width: WIDTH,
                                height: HEIGHT,
                                margin: "auto"
                            }}>
                                <ReactHeatmap
                                    data={{
                                        max: this.props.heatmapData.maxs.ball,
                                        data: this.props.heatmapData.data.ball
                                    }}
                                    style={{width: WIDTH, height: HEIGHT}}
                                    config={{
                                        radius: 18
                                    }}/>
                            </div>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        )
    }

    private readonly nameCompareFn = (a: ReplayPlayer, b: ReplayPlayer) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()
        if (nameA < nameB) {
            return -1
        }
        if (nameA > nameB) {
            return 1
        }
        return 0
    }

    private readonly createHeatmap = (player: ReplayPlayer) => ( // TODO: Standardise with ball heatmap above
        <Grid item key={player.name} xs={12} md={6} lg={4}
              style={{height: 375, minWidth: WIDTH, textAlign: "center"}}>
            <Typography>{player.name}</Typography>
            <div
                style={{
                    background: `url(/fieldrblack.png) no-repeat center`,
                    backgroundSize: "250px 350px",
                    width: WIDTH,
                    height: HEIGHT,
                    margin: "auto"
                }}
            >
                <ReactHeatmap
                    data={{
                        max: this.props.heatmapData.maxs[player.name],
                        // max: 1,
                        data: this.props.heatmapData.data[player.name]
                    }}
                    style={{width: WIDTH, height: HEIGHT}}
                    config={{
                        radius: 18
                    }}
                />
            </div>
        </Grid>
    )
}

export const HeatmapContent = withStyles(styles)(HeatmapContentComponent)

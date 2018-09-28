import {Grid, Typography} from "@material-ui/core"
import * as React from "react"
import {PlayStyleResponse} from "../../../Models/Player/PlayStyle"
import {PlayerPlayStyleChart} from "../Overview/PlayStyle/PlayerPlayStyleChart"

interface Props {
    ids: string[]
    players: Player[]
    playerPlayStyles: PlayStyleResponse[]
}

export class PlayerCompareCharts extends React.PureComponent<Props> {
    public render() {
        const {players, playerPlayStyles} = this.props

        const compareChartDatas = playerPlayStyles[0].chartDatas
            .map((_, i) => playerPlayStyles
                .map((playStyleResponse) => playStyleResponse.chartDatas[i])
            )
        const chartTitles = playerPlayStyles[0].chartDatas.map((chartData) => chartData.title)

        return (
            <>
                {chartTitles.map((chartTitle, i) => {
                    return (
                        <Grid item xs={12} md={5} lg={3} key={chartTitle}
                              style={{height: 400}}>
                            <Typography variant="subheading" align="center">
                                {chartTitle}
                            </Typography>
                            <PlayerPlayStyleChart names={players.map((player) => player.name)}
                                                data={compareChartDatas[i]}/>
                        </Grid>
                    )
                })}
            </>
        )
    }
}

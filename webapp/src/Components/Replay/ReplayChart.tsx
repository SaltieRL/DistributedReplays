import Grid from "@material-ui/core/Grid/Grid"
import { ChartDataSets, ChartOptions } from "chart.js"
import * as React from "react"
import { HorizontalBar } from "react-chartjs-2"
import { Replay } from "../../Models"
import { getChartColors } from "../../Utils/Color"

interface Props {
    replay: Replay
}

export class ReplayChart extends React.PureComponent<Props> {
    public render() {
        return (
            <Grid container style={{minWidth: "400px"}}>
                {this.getBars()}
            </Grid>
        )
    }

    private readonly getBars = () => {
        const labelToKeys = new Map<string, keyof ReplayPlayer>()
            .set("Score", "score")
            .set("Goals", "goals")
            .set("Assists", "assists")
            .set("Saves", "saves")
            .set("Shots", "shots")
        let showLegend = true

        return Array.from(labelToKeys, (([label, key]) => {
            const data = {
                labels: [label],
                datasets: this.getDatasets(this.props.replay, key)
            }
            let positiveValuesSum = 0
            let negativeValuesSum = 0
            data.datasets.forEach((dataset) => {
                const playerData = dataset.data as number[]
                playerData[0] < 0 ? negativeValuesSum += playerData[0] : positiveValuesSum += playerData[0]
            })

            const xLimit = Math.round(Math.max(-negativeValuesSum, positiveValuesSum) * 1.2) + 1

            const element = (
                <HorizontalBar
                    key={label}
                    data={data}
                    options={this.getOptions(showLegend, xLimit)}
                    height={showLegend ? 100 : 80}
                    width={300}
                />
            )

            showLegend = false
            return (
                <Grid item xs={12} key={key}>
                    {element}
                </Grid>
            )
        }))
    }

    private getDatasets(replay: Replay, key: string): ChartDataSets[] {
        return replay.players.map((player, index) => {
            let playerData = [player[key]]
            if (!player.isOrange) {
                playerData = playerData.map((value) => -value)
            }

            return {
                label: player.name,
                data: playerData,
                stack: "1",
                ...getChartColors(player.isOrange, index)
            }
        })
    }

    private readonly getOptions = (showLegend: boolean, xLimit: number): ChartOptions => {
        return {
            scales: {
                xAxes: [{
                    stacked: true,
                    gridLines: {
                        zeroLineWidth: 2,
                        zeroLineColor: "rgba(0, 0, 0, 0.3)",
                        drawBorder: false
                    },
                    ticks: {
                        min: -xLimit,
                        max: xLimit,
                        callback: (value: any) => value < 0 ? -parseInt(value, 10) : parseInt(value, 10)
                    },
                    afterFit: (scaleInstance) => {
                        scaleInstance.width = 100
                    }
                }],
                yAxes: [{
                    stacked: true,
                    gridLines: {
                        display: false
                    },
                    barThickness: 25,
                    afterFit: (scaleInstance) => {
                        scaleInstance.width = 50
                    }
                }]
            },
            legend: {
                display: showLegend,
                onClick: (e) => e.stopPropagation()
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem, data) => data.datasets![tooltipItem.datasetIndex!].label + ": " +
                        Math.abs(parseInt(tooltipItem.xLabel!, 10))
                }
            },
            maintainAspectRatio: false
        }
    }
}

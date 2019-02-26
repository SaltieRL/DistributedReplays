import { ChartData, ChartOptions, ChartPoint, ChartTooltipItem } from "chart.js"
import * as React from "react"
import { Line } from "react-chartjs-2"
import { PlayStyleProgressionPoint } from "../../../../Models"
import { roundLabelToMaxDPCallback } from "../../../../Utils/Chart"
import { colorsForPlaylists } from "../../../../Utils/Color"

interface PlayerPlayStyleProgression {
    player: Player
    playStyleProgressionPoints: PlayStyleProgressionPoint[]
}

interface Props {
    field: string
    playerPlayStyleProgressions: PlayerPlayStyleProgression[]
}

export class ProgressionChart extends React.PureComponent<Props> {
    public render() {
        return (
            <Line data={this.getChartData()} options={this.getChartOptions()}/>
        )
    }

    private readonly getChartData = (): ChartData => {
        return {
            datasets: this.props.playerPlayStyleProgressions
                .map((playerPlayStyleProgression, i) => {
                    return {
                        label: playerPlayStyleProgression.player.name,
                        data: playerPlayStyleProgression.playStyleProgressionPoints.map(
                            (playStyleProgressionPoint) => {
                                return {
                                    x: playStyleProgressionPoint.date as any,
                                    y: playStyleProgressionPoint.dataPoints
                                        .find((dataPoint) => dataPoint.name === this.props.field)!.average
                                } as ChartPoint
                            }),
                        fill: false,
                        backgroundColor: colorsForPlaylists[i % 4] + "44",
                        pointBackgroundColor: colorsForPlaylists[i % 4] + "bb",
                        borderColor: colorsForPlaylists[i % 4] + "88",
                        pointHoverBackgroundColor: colorsForPlaylists[i % 4] + "dd"
                        // TODO: Make this and PlayerPlayStyleChart use some specifically-made colours
                    }
                })
        }
    }

    private readonly getChartOptions = (): ChartOptions => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: "time",
                    time: {
                        displayFormats: {
                            month: "MMM 'YY",
                            quarter: "MMM 'YY",
                            year: "YYYY"
                        }
                    },
                    ticks: {
                        autoSkip: true
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem: ChartTooltipItem, data: ChartData) =>
                        roundLabelToMaxDPCallback(tooltipItem, data, 4)
                }
            }
        }
    }
}

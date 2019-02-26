import { ChartData, ChartOptions } from "chart.js"
import * as React from "react"
import { Bar } from "react-chartjs-2"
import { BasicStat } from "../../../Models"
import { roundLabelToMaxDPCallback } from "../../../Utils/Chart"
import { convertHexToRgba, getPrimaryColorsForPlayers, primaryColours } from "../../../Utils/Color"

interface Props {
    basicStat: BasicStat
}

export class ColoredBarChart extends React.PureComponent<Props> {
    public render() {
        return (
            <Bar data={this.getChartData()} options={this.getChartOptions()}/>
        )
    }

    private readonly getChartData = (): ChartData => {
        const chartDataPoints = this.props.basicStat.chartDataPoints
        const backgroundColors = chartDataPoints[0].isOrange !== undefined ?
            getPrimaryColorsForPlayers(
                chartDataPoints.map((chartDataPoint) => chartDataPoint.isOrange)
            )
            :
            primaryColours.slice(0, chartDataPoints.length).map((hexColor) => convertHexToRgba(hexColor, 0.7))

        return {
            labels: chartDataPoints.map((chartDataPoint) => chartDataPoint.name),
            datasets:
                [
                    {
                        data: chartDataPoints.map((chartDataPoint) => chartDataPoint.value),
                        backgroundColor: backgroundColors
                    }
                ]
        }
    }

    private readonly getChartOptions = (): ChartOptions => {
        return {
            legend: {display: false},
            scales: {
                yAxes: [
                    {ticks: {maxTicksLimit: 5, beginAtZero: true}}
                ]
            },
            tooltips: {
                callbacks: {
                    label: roundLabelToMaxDPCallback
                }
            }
        } as ChartOptions
    }
}

import { ChartData, ChartOptions, ChartTooltipItem } from "chart.js"
import * as React from "react"
import { Pie } from "react-chartjs-2"
import { BasicStat } from "../../../Models"
import { convertHexToRgba, getPrimaryColorsForPlayers, primaryColours } from "../../../Utils/Color"
import { roundNumberToMaxDP } from "../../../Utils/String"

interface Props {
    basicStat: BasicStat
}

export class ColoredPieChart extends React.PureComponent<Props> {
    public render() {
        return (
            <Pie data={this.getChartData()} options={this.getChartOptions()}/>
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
            rotation: this.getStartAngle(),
            tooltips: {
                callbacks: {
                    beforeLabel: (tooltipItem: ChartTooltipItem, data: ChartData) => {
                        return data.labels![tooltipItem.index!]
                    },
                    label: (tooltipItem: ChartTooltipItem, data: ChartData) => {
                        const value = data.datasets![tooltipItem.datasetIndex!].data![tooltipItem.index!] as number
                        return roundNumberToMaxDP(value)
                    }
                }
            }
        } as ChartOptions  // startAngle is not typed in ChartOptions
    }

    private readonly getStartAngle = (): number => {
        const numberOfPlayers = this.props.basicStat.chartDataPoints.length
        switch (numberOfPlayers) {
            case 6:
            case 4:
                return Math.PI / 2
            default:
                return 0
        }
    }
}

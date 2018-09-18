import {ChartData, ChartOptions} from "chart.js"
import * as React from "react"
import {Bar} from "react-chartjs-2"
import {BasicStat} from "../../../Models/ChartData"
import {getPrimaryColorsForPlayers} from "../../../Utils/Color"

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
        return {
            labels: chartDataPoints.map((chartDataPoint) => chartDataPoint.name),
            datasets:
                [
                    {
                        data: chartDataPoints.map((chartDataPoint) => chartDataPoint.value),
                        backgroundColor: getPrimaryColorsForPlayers(
                            chartDataPoints.map((chartDataPoint) => chartDataPoint.isOrange)
                        )
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
            }
        } as ChartOptions
    }
}

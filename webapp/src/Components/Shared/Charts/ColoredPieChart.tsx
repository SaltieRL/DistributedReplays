import {ChartData, ChartOptions} from "chart.js"
import * as React from "react"
import {Pie} from "react-chartjs-2"
import {BasicStat} from "../../../Models/ChartData"
import {roundLabelToMaxDPCallback} from "../../../Utils/Chart"
import {getPrimaryColorsForPlayers} from "../../../Utils/Color"

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
            rotation: this.getStartAngle(),
            tooltips: {
                callbacks: {
                    label: roundLabelToMaxDPCallback
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

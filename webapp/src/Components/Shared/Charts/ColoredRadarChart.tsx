import {ChartData, ChartDataSets, ChartOptions} from "chart.js"
import * as React from "react"
import {Radar} from "react-chartjs-2"
import {BasicStat} from "../../../Models/ChartData"
import {roundLabelToMaxDPCallback} from "../../../Utils/Chart"
import {getPrimaryColorsForPlayers} from "../../../Utils/Color"

interface Props {
    basicStat: BasicStat
}

export class ColoredRadarChart extends React.PureComponent<Props> {
    public render() {
        // const options = {
        //     legend: {display: false},
        //     scale: {
        //         ticks: {
        //             maxTicksLimit: 5,
        //             beginAtZero: true
        //         }
        //     }
        // }
        return (
            <Radar data={this.getChartData} options={this.getChartOptions()}/>
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
                        radius: 5,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        pointHitRadius: 5,
                        pointBackgroundColor: getPrimaryColorsForPlayers(
                            chartDataPoints.map((chartDataPoint) => chartDataPoint.isOrange)
                        )
                    } as ChartDataSets
                    // Types don't know about the radius property
                    // https://stackoverflow.com/questions/39636043/chart-js-data-points-get-smaller-after-hover
                ]
        }
    }

    private readonly getChartOptions = (): ChartOptions => {
        return {
            legend: {display: false},
            scale: {
                ticks: {
                    maxTicksLimit: 5,
                    beginAtZero: true
                }
            },
            tooltips: {
                callbacks: {
                    label: roundLabelToMaxDPCallback
                }
            },
            startAngle: this.getStartAngle()
        } as ChartOptions  // Radar only supports 1 scale, 'scale' is typed generically as 'scales'
    }

    private readonly getStartAngle = (): number => {
        const numberOfPlayers = this.props.basicStat.chartDataPoints.length
        switch (numberOfPlayers) {
            case 6:
                return 210
            case 4:
                return 225
            default:
                return 0
        }
    }
}

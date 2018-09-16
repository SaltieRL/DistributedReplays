import {ChartData} from "chart.js"
import * as React from "react"
import {Radar} from "react-chartjs-2"
import {BasicStat} from "../../../Models/ChartData"
import {getPrimaryColorsForPlayers} from "../../../Utils/Color"


interface Props {
    basicStat: BasicStat
}

export class ColoredRadarChart extends React.PureComponent<Props> {
    public render() {
        const options = {
            legend: {display: false},
            scale: {
                ticks: {
                    maxTicksLimit: 5,
                    beginAtZero: true
                }
            }
        }
        return (
            <Radar data={this.getChartData} options={options}/>
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
                        pointRadius: 5,
                        pointBackgroundColor: getPrimaryColorsForPlayers(
                            chartDataPoints.map((chartDataPoint) => chartDataPoint.isOrange)
                        )
                    }
                ]
        }
    }
}

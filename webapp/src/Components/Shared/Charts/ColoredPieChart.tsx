import {ChartData} from "chart.js"
import * as React from "react"
import {Pie} from "react-chartjs-2"
import {BasicStat} from "../../../Models/ChartData"
import {getPrimaryColorsForPlayers} from "../../../Utils/Color"


interface Props {
    basicStat: BasicStat
}

export class ColoredPieChart extends React.PureComponent<Props> {
    public render() {
        const options = {
            legend: {display: false}
        }
        return (
            <Pie data={this.getChartData} options={options}/>
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
}

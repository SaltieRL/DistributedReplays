import * as React from "react"
import { BasicStat } from "src/Models/ChartData"
import { ColoredBarChart } from "./ColoredBarChart"
import { ColoredPieChart } from "./ColoredPieChart"
import { ColoredRadarChart } from "./ColoredRadarChart"

interface Props {
    basicStat: BasicStat
}

export class StatChart extends React.PureComponent<Props> {
    public render() {
        const Chart = this.getChartType()
        return (
            <Chart basicStat={this.props.basicStat}/>
        )
    }

    private readonly getChartType = (): React.ComponentType<{ basicStat: BasicStat }> => {
        switch (this.props.basicStat.type) {
            case "radar":
                if (this.props.basicStat.chartDataPoints.length > 2) {
                    return ColoredRadarChart
                }
                return ColoredBarChart
            case "bar":
                return ColoredBarChart
            case "pie":
                return ColoredPieChart
            default:
                throw Error
        }
    }
}

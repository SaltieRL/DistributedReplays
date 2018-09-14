import * as React from "react"
import {BasicStat} from "../../../Models/ChartData"
import {ColoredBarChart} from "./ColoredBarChart"
import {ColoredPieChart} from "./ColoredPieChart"
import {ColoredRadarChart} from "./ColoredRadarChart"

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

    private readonly getChartType = (): React.ComponentType<{basicStat: BasicStat}> => {
        switch (this.props.basicStat.type) {
            case "radar":
                return ColoredRadarChart
            case "pie":
                return ColoredPieChart
            case "bar":
                return ColoredBarChart
            default:
                throw Error
        }
    }
}

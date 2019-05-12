import { Tooltip } from "@material-ui/core"
import * as React from "react"
import { BasicStat } from "../../../Models"
import { ColoredBarChart } from "./ColoredBarChart"
import { ColoredPieChart } from "./ColoredPieChart"
import { ColoredRadarChart } from "./ColoredRadarChart"

interface Props {
    basicStat: BasicStat
    explanations: Record<string, any> | undefined
}

export class StatChart extends React.PureComponent<Props> {
    public render() {
        const Chart = this.getChartType()
        const title = this.props.basicStat.title// .replace(/\s/g, "_")
        return (
            <>
            {this.props.explanations && (this.props.explanations.hasOwnProperty(title) ?
                <Tooltip title={this.props.explanations[this.props.basicStat.title].simple_explanation}>
                    <div>
                        <Chart basicStat={this.props.basicStat}/>
                    </div>
                </Tooltip>
                :
                <Chart basicStat={this.props.basicStat}/>)}
        </>
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

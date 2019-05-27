import { Tooltip, WithTheme, withTheme } from "@material-ui/core"
import Chart from "chart.js"
import * as React from "react"
import { BasicStat } from "../../../Models"
import { ColoredBarChart } from "./ColoredBarChart"
import { ColoredPieChart } from "./ColoredPieChart"
import { ColoredRadarChart } from "./ColoredRadarChart"

interface OwnProps {
    basicStat: BasicStat
    explanations: Record<string, any> | undefined
}

type Props = OwnProps & WithTheme

class StatChartComponent extends React.PureComponent<Props> {
    public render() {
        const isDarkTheme = this.props.theme.palette.type === "dark"
        Chart.defaults.global.defaultFontColor = isDarkTheme ? "white" : "grey"
        Chart.defaults.radar.scale.ticks = {
            backdropColor: this.props.theme.palette.background.paper + "88"
        }

        const ChartType = this.getChartType()
        const title = this.props.basicStat.title
        return (
            <>
                {this.props.explanations && (this.props.explanations.hasOwnProperty(title) ?
                    <Tooltip title={this.props.explanations[this.props.basicStat.title].simple_explanation}>
                        <div>
                            <ChartType basicStat={this.props.basicStat}/>
                        </div>
                    </Tooltip>
                    :
                    <ChartType basicStat={this.props.basicStat}/>)}
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

export const StatChart = withTheme()(StatChartComponent)

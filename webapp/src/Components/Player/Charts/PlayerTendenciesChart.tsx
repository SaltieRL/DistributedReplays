import {WithTheme, withTheme} from "@material-ui/core"
import {ChartData, LinearTickOptions, RadialChartOptions} from "chart.js"
import * as React from "react"
import {Radar} from "react-chartjs-2"
import {convertHexToRgba} from "../../../Utils/Color"
import {PlayStyleChartData} from "../PlayerTendencies"

interface OwnProps {
    data: PlayStyleChartData
}

type Props = OwnProps
    & WithTheme

export class PlayerTendenciesChartComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <Radar data={this.getChartData()} options={this.getChartOptions()}/>
        )
    }

    private readonly getChartData = (): ChartData => {
        const chartData = this.props.data.spokeData
        const themeColors = this.props.theme.palette.secondary

        return {
            labels: chartData.map((spokeData) => spokeData.name),
            datasets: [
                {
                    label: "Player",
                    data: chartData.map((spokeData) => spokeData.value),
                    backgroundColor: convertHexToRgba(themeColors.light, 0.4),
                    pointBackgroundColor: convertHexToRgba(themeColors.dark),
                    borderColor: convertHexToRgba(themeColors.main, 0.5)
                },
                {
                    label: "Average",
                    data: chartData.map((spokeData) => spokeData.average === undefined ? 0 : spokeData.average)
                }
            ]
        }
    }

    private readonly getChartOptions = (): RadialChartOptions => {
        return {
            scale: {
                ticks: {
                    suggestedMin: -1,
                    suggestedMax: 1,
                    maxTicksLimit: 5
                } as LinearTickOptions
            }
        }
    }
}

export const PlayerTendenciesChart = withTheme()(PlayerTendenciesChartComponent)

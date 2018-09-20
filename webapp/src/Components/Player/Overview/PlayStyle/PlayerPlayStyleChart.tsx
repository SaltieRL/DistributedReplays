import {WithTheme, withTheme} from "@material-ui/core"
import {ChartData, ChartDataSets, LinearTickOptions, RadialChartOptions} from "chart.js"
import * as React from "react"
import {Radar} from "react-chartjs-2"
import {ChartDataResponse} from "../../../../Models/ChartData"
import {roundLabelToMaxDPCallback} from "../../../../Utils/Chart"
import {convertHexToRgba} from "../../../../Utils/Color"

interface OwnProps {
    data: ChartDataResponse
}

type Props = OwnProps
    & WithTheme

class PlayerPlayStyleChartComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <Radar data={this.getChartData()} options={this.getChartOptions()}/>
        )
    }

    private readonly getChartData = (): ChartData => {
        const chartDataPoints = this.props.data.chartDataPoints
        const themeColors = this.props.theme.palette.secondary

        return {
            labels: chartDataPoints.map((chartDataPoint) => chartDataPoint.name),
            datasets: [
                {
                    label: "Player",
                    data: chartDataPoints.map((chartDataPoint) => chartDataPoint.value),
                    backgroundColor: convertHexToRgba(themeColors.light, 0.4),
                    pointBackgroundColor: convertHexToRgba(themeColors.dark),
                    borderColor: convertHexToRgba(themeColors.main, 0.5),
                    radius: 5,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointHitRadius: 5
                } as ChartDataSets,
                {
                    label: "Average",
                    data: chartDataPoints.map((chartDataPoint) =>
                        chartDataPoint.average === undefined ? 0 : chartDataPoint.average)
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
            },
            tooltips: {
              callbacks: {
                  label: roundLabelToMaxDPCallback
              }
            },
            maintainAspectRatio: false
        }
    }
}

export const PlayerPlayStyleChart = withTheme()(PlayerPlayStyleChartComponent)

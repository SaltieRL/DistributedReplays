import { withTheme, WithTheme } from "@material-ui/core"
import { ChartData, ChartDataSets, LinearTickOptions, RadialChartOptions } from "chart.js"
import * as React from "react"
import { Radar } from "react-chartjs-2"
import { ChartDataPoint, ChartDataResponse } from "../../../../Models"
import { roundLabelToMaxDPCallback } from "../../../../Utils/Chart"
import { colorsForPlaylists, convertHexToRgba } from "../../../../Utils/Color"

interface OwnProps {
    names: string[]
    data: ChartDataResponse[]
}

type Props = OwnProps
    & WithTheme

type ChartDataSetColors = Pick<ChartDataSets, "backgroundColor" | "pointBackgroundColor" | "borderColor">[]

class PlayerPlayStyleChartComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <Radar data={this.getChartData()} options={this.getChartOptions()} redraw/>
        )
    }

    private readonly getChartData = (): ChartData => {
        const {names, data} = this.props

        const labels = data[0].chartDataPoints.map((chartDataPoint: ChartDataPoint) => chartDataPoint.name)
        const averageData = data[0].chartDataPoints.map((chartDataPoint: ChartDataPoint) =>
            chartDataPoint.average === undefined ? 0 : chartDataPoint.average)
        const chartDataSetColors = this.getChartDataSetColors()

        const playerChartDataSets: ChartDataSets[] = data
            .map((chartDataResponse: ChartDataResponse, i: number) => {
                return {
                    label: names[i],
                    data: chartDataResponse.chartDataPoints.map((chartDataPoint) => chartDataPoint.value),
                    ...chartDataSetColors[i],
                    radius: 5,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointHitRadius: 5
                }
            })

        return {
            labels,
            datasets: [
                ...playerChartDataSets,
                {
                    label: "Average",
                    data: averageData
                }
            ]
        }
    }

    private readonly getChartDataSetColors = (): ChartDataSetColors => {
        const {names} = this.props
        if (names.length === 1) {
            const themeColors = this.props.theme.palette.secondary
            return [{
                backgroundColor: convertHexToRgba(themeColors.light, 0.4),
                pointBackgroundColor: convertHexToRgba(themeColors.dark),
                borderColor: convertHexToRgba(themeColors.main, 0.5)
            }]
        }

        return names.map((_, i) => {
            return {
                backgroundColor: colorsForPlaylists[i % 4] + "44",
                pointBackgroundColor: colorsForPlaylists[i % 4] + "bb",
                borderColor: colorsForPlaylists[i % 4] + "88",
                pointHoverBackgroundColor: colorsForPlaylists[i % 4] + "dd"
                // TODO: Make this and ProgressionChart use some specifically-made colours
            }
        })
    }

    private readonly getChartOptions = (): RadialChartOptions => {
        return {
            scale: {
                ticks: {
                    suggestedMin: -2,
                    suggestedMax: 2,
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

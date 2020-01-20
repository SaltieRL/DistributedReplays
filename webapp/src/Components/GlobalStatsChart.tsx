import {ChartData, ChartDataSets, ChartOptions, ChartTooltipItem} from "chart.js"
import * as _ from "lodash"
import * as React from "react"
import {Bar} from "react-chartjs-2"
import {roundLabelToMaxDPCallback} from "../Utils/Chart"
import {colorsForPlaylists, convertHexToRgba} from "../Utils/Color"

interface Props {
    graph: GlobalStatsGraph
}

export class GlobalStatsChart extends React.PureComponent<Props> {
    public render() {
        return <Bar data={this.getChartData()} options={this.getChartOptions()} />
    }

    private readonly getChartData = (): ChartData => {
        const datasets = this.props.graph.data

        // Threshold so long tails due to outliers are not shown.
        // TODO: Remove, move to backend.
        const maxValues = datasets.map((dataset) => Math.max(...dataset.values))
        const maxValueThreshold = 0.01
        datasets.forEach((dataset, i) => {
            const datasetMax = maxValues[i]
            dataset.keys = dataset.keys.filter((__, j) => dataset.values[j] > datasetMax * maxValueThreshold)
            dataset.values = dataset.values.filter((__, j) => dataset.values[j] > datasetMax * maxValueThreshold)
        })
        const labels = _.union(...datasets.map((dataset) => dataset.keys)).sort((a, b) => a - b)

        return {
            labels: labels.map((value) => value.toString()),
            datasets: datasets.map(
                (dataset, i): ChartDataSets => ({
                    label: dataset.name,
                    data: labels.map((label) => {
                        // TODO: Make this not really unoptimal. Maybe by changing backend return type.
                        const index = dataset.keys.findIndex((key) => key === label)
                        if (index === -1) {
                            return 0
                        }
                        return dataset.values[index]
                    }),
                    backgroundColor: convertHexToRgba(colorsForPlaylists[i], 0.8)
                })
            )
        }
    }

    private readonly getChartOptions = (): ChartOptions => {
        return {
            responsive: true,
            scales: {
                xAxes: [
                    {
                        stacked: true,
                        barPercentage: 1,
                        categoryPercentage: 1,
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 6
                        }
                    }
                ],
                yAxes: [
                    {
                        stacked: false,
                        ticks: {
                            beginAtZero: true,
                            autoSkip: true,
                            maxTicksLimit: 8
                        }
                    }
                ]
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem: ChartTooltipItem, data: ChartData) =>
                        roundLabelToMaxDPCallback(tooltipItem, data, 4)
                }
            }
        }
    }
}

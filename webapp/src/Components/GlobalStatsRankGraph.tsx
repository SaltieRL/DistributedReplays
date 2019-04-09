import { ChartData, ChartOptions, ChartTooltipItem } from "chart.js"
import * as React from "react"
import { Line } from "react-chartjs-2"
import { roundLabelToMaxDPCallback } from "../Utils/Chart"

interface Props {
    graph: any
}

export class GlobalStatsRankGraph extends React.PureComponent<Props> {
    public render() {
        return (
            <Line data={this.getChartData()} options={this.getChartOptions()}/>
        )
    }

    private readonly getChartData = (): ChartData => {
        const pointBackgroundColors = [
            "#000000", // unranked
            "#a56113", "#a56113", "#a56113", // bronze
            "#b7b7b6", "#b7b7b6", "#b7b7b6", // silver
            "#fae550", "#fae550", "#fae550", // gold
            "#93e0f6", "#93e0f6", "#93e0f6", // platinum
            "#52aeee", "#52aeee", "#52aeee", // diamond
            "#d9bef8", "#d9bef8", "#d9bef8", // champ
            "#c19dee" // GC BTW
        ]
        const data = this.props.graph
        return {
            labels: ["Unranked", "Bronze I", "Bronze II", "Bronze III", "Silver I", "Silver II", "Silver III", "Gold I",
                "Gold II", "Gold III", "Platinum I", "Platinum II", "Platinum III", "Diamond I", "Diamond II",
                "Diamond III", "Champion I", "Champion II", "Champion III", "Grand Champion"],
            datasets: [{
                label: "Data",
                data: data.map((point: any) => {
                    return point.mean === null ? Math.random() * 10 : point.mean
                }),
                pointBackgroundColor: pointBackgroundColors
            }]
        }
    }

    private readonly getChartOptions = (): ChartOptions => {
        return {
            responsive: true,
            scales: {
                xAxes: [{
                    ticks: {
                        display: false //this will remove only the label
                    }
                }]
            },

            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem: ChartTooltipItem, data: ChartData) =>
                        roundLabelToMaxDPCallback(tooltipItem, data, 3)
                }
            }
        }
    }
}

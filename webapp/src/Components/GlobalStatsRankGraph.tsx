import { ChartData, ChartOptions, ChartTooltipItem } from "chart.js"
import * as React from "react"
import { Line } from "react-chartjs-2"
import { roundLabelToMaxDPCallback } from "../Utils/Chart"

interface Props {
    graph: any  // TODO(Sciguymjm) Type this thing.
}

export class GlobalStatsRankGraph extends React.PureComponent<Props> {
    public render() {
        return (
            <div style={{width: "95%"}}>
                <Line data={this.getChartData()} options={this.getChartOptions()}/>
            </div>
        )
    }

    private readonly getChartData = (): ChartData => {
        const SLICE_START = 4
        const pointBackgroundColors = [
            "#000000", // unranked
            "#a56113", "#a56113", "#a56113", // bronze
            "#b7b7b6", "#b7b7b6", "#b7b7b6", // silver
            "#fae550", "#fae550", "#fae550", // gold
            "#93e0f6", "#93e0f6", "#93e0f6", // platinum
            "#52aeee", "#52aeee", "#52aeee", // diamond
            "#d9bef8", "#d9bef8", "#d9bef8", // champ
            "#c19dee" // GC BTW
        ].slice(SLICE_START)

        const data = this.props.graph
        return {
            labels: ["Unranked", "Bronze I", "Bronze II", "Bronze III", "Silver I", "Silver II", "Silver III", "Gold I",
                "Gold II", "Gold III", "Platinum I", "Platinum II", "Platinum III", "Diamond I", "Diamond II",
                "Diamond III", "Champion I", "Champion II", "Champion III", "Grand Champion",
                "null"].slice(SLICE_START),
            datasets: [{
                label: "Data",
                data: data.slice(SLICE_START).map((point: any) => { // TODO(Sciguymjm) Type this thing.
                    // return point.mean === null ? Math.random() * 10 : point.mean
                    return point.mean
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
                        display: false // this will remove only the label
                    }
                }],
                yAxes: [{
                    ticks: {

                        maxTicksLimit: 5
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

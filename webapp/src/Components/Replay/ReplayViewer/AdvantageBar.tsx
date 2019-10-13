import { ChartData, ChartOptions } from "chart.js"
import * as React from "react"
import { Bar } from "react-chartjs-2"
import { roundLabelToMaxDPCallback } from "../../../Utils/Chart"

interface Props {
    data: number[]
}

export class AdvantageBarChart extends React.PureComponent<Props> {
    public render() {
        try {
            const data = this.getChartData()
            console.log(data)
            return (
                <Bar data={data} options={this.getChartOptions()}/>
            )
        } catch(err) {
            console.log(err)
            return ("")
        }
    }

    private readonly getChartData = (): ChartData => {
        return {
            labels: this.props.data.map((value, i) => {
                return i.toString()
            }),
            datasets: [{

                data: this.props.data,
                backgroundColor: "#BB0000"

            }]
        }
    }

    private readonly getChartOptions = (): ChartOptions => {
        return {
            legend: {display: false},
            scales: {
                yAxes: [
                    {ticks: { max: 1, stepSize:0.2, beginAtZero: true}, bounds: 'ticks'}
                ]
            },
            responsive: true,
            tooltips: {
                callbacks: {
                    label: roundLabelToMaxDPCallback
                }
            }
        } as ChartOptions
    }
}

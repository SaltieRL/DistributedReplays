import { ChartData, ChartOptions } from "chart.js"
import * as React from "react"
import {HorizontalBar} from "react-chartjs-2"
import { roundLabelToMaxDPCallback } from "../../../Utils/Chart"

interface Props {
    blue: number[]
    orange: number[]
}

export class AdvantageBarChart extends React.PureComponent<Props> {
    public render() {
        try {
            const data = this.getChartData()
            console.log(data)
            return (
                <HorizontalBar data={data} options={this.getChartOptions()}/>
            )
        } catch(err) {
            console.log(err)
            return ("")
        }
    }

    private readonly getChartData = (): ChartData => {
        return {
            labels: this.props.blue.map((value, i) => {
                return i.toString()
            }),
            datasets: [{
                data: this.props.blue,
                backgroundColor: "#00BB00"
            },
            {
                data: this.props.orange,
                backgroundColor: "#BB0000"
            },
            ]
        }
    }

    private readonly getChartOptions = (): ChartOptions => {
        return {
            legend: {display: false},
            scales: {
                xAxes: [
                    {
                        stacked: true,
                        ticks: { max: 1, stepSize:0.2, beginAtZero: true},
                        bounds: 'ticks',
                        afterFit: (scaleInstance) => {
                            scaleInstance.width = 100
                        }
                    }

                ],
                yAxes: [{
                    stacked: true,
                    gridLines: {
                        display: false
                    },
                    barThickness: 25,
                    afterFit: (scaleInstance) => {
                        scaleInstance.width = 50
                    }
                }]
            },
            maintainAspectRatio: false,
            responsive: true,
            tooltips: {
                callbacks: {
                    label: roundLabelToMaxDPCallback
                }
            }
        } as ChartOptions
    }
}

import { Card, CardContent, CardHeader } from "@material-ui/core"
import { ChartData, ChartOptions, ChartPoint, ChartTooltipItem } from "chart.js"
import * as React from "react"
import { Line } from "react-chartjs-2"
import { ItemFull, ItemUsage } from "../../Models/ItemStats"
import { roundLabelToMaxDPCallback } from "../../Utils/Chart"
import { primaryColours } from "../../Utils/Color"

interface Props {
    item: ItemFull
    itemUsage: ItemUsage
}

export class ItemStatsGraph extends React.PureComponent<Props> {

    public render() {
        return (

            <Card>
                <CardHeader title={"Item Usage"}/>
                <CardContent style={{minHeight: "50vh"}}>
                    <Line data={this.getChartData()} options={this.getChartOptions()}/>
                </CardContent>
            </Card>
        )
    }

    private readonly getChartData = (): ChartData => {
        const {item, itemUsage} = this.props
        return {
            datasets: [
                {
                    label: item.name,
                    data: itemUsage.data.map(
                        (dataPoint) => {
                            return {
                                x: dataPoint.date as any,
                                y: dataPoint.count / dataPoint.total * 100
                            } as ChartPoint
                        }),
                    fill: true,
                    backgroundColor: primaryColours[0] + "44",
                    pointBackgroundColor: primaryColours[0] + "bb",
                    borderColor: primaryColours[0] + "88",
                    pointHoverBackgroundColor: primaryColours[0] + "dd"
                }
            ]
        }
    }

    private readonly getChartOptions = (): ChartOptions => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: "time",
                    time: {
                        displayFormats: {
                            month: "MMM 'YY",
                            quarter: "MMM 'YY",
                            year: "YYYY"
                        }
                    },
                    ticks: {
                        autoSkip: true
                    }
                }]
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

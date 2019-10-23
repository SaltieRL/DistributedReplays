import { Card, CardContent, CardHeader } from "@material-ui/core"
import { ChartData, ChartOptions, ChartPoint, ChartTooltipItem } from "chart.js"
import * as React from "react"
import { Line } from "react-chartjs-2"
import { Item, ItemFull, ItemUsage } from "../../Models/ItemStats"
import { getItemGraph } from "../../Requests/Global"
import { roundLabelToMaxDPCallback } from "../../Utils/Chart"
import { primaryColours } from "../../Utils/Color"
import { ItemMultiSelect } from "./ItemMultiSelect"

interface Props {
    item: ItemFull
    itemUsage: ItemUsage
}

interface State {
    selectedCompare: Item[]
    items: ItemUsage[]
}

export class ItemStatsGraph extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {selectedCompare: [], items: []}
    }

    public componentDidMount(): void {
        this.getExtraItemData()
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (this.state.selectedCompare.length !== prevState.selectedCompare.length) {
            this.getExtraItemData()
        }
    }

    public render() {
        return (
            <Card>
                <CardHeader title={"Item usage over time"}
                            action={<ItemMultiSelect setSelectedItem={this.setSelectedItem}
                                                     selected={this.state.selectedCompare}/>}/>
                <CardContent style={{minHeight: "30vh"}}>
                    <Line data={this.getChartData()} options={this.getChartOptions()}/>
                </CardContent>
            </Card>
        )
    }

    private readonly setSelectedItem = (item: any) => {
        this.setState({selectedCompare: item}, () => {
            console.log(item)
        })
    }

    private readonly getExtraItemData = () => {
        return Promise.all(this.state.selectedCompare.map((item: Item) => getItemGraph(item.ingameid)))
            .then((data) => {
                this.setState({items: data})
            })
    }

    private readonly getChartData = (): ChartData => {
        const {item, itemUsage} = this.props
        const extraData = this.state.items.map((usage: ItemUsage, index: number) =>
            this.usageToDataset(this.state.selectedCompare[index], usage, index+1))
        return {
            datasets: [
                this.usageToDataset(item, itemUsage, 0),
                ...extraData
            ]
        }
    }

    private readonly usageToDataset = (item: Item, itemUsage: ItemUsage, colorIndex: number) => {
        colorIndex = colorIndex % primaryColours.length
        return {
            label: item.name,
            data: itemUsage.data.map(
                (dataPoint) => {
                    return {
                        x: dataPoint.date as any,
                        y: dataPoint.count / dataPoint.total * 100
                    } as ChartPoint
                }),
            fill: true,
            backgroundColor: primaryColours[colorIndex] + "44",
            pointBackgroundColor: primaryColours[colorIndex] + "bb",
            borderColor: primaryColours[colorIndex] + "88",
            pointHoverBackgroundColor: primaryColours[colorIndex] + "dd"
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

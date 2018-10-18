import { ChartData, ChartTooltipItem } from "chart.js"
import { roundNumberToMaxDP } from "./String"

export const roundLabelToMaxDPCallback = (tooltipItem: ChartTooltipItem, data: ChartData, decimalPoints?: number) => {
    let label = data.datasets![tooltipItem.datasetIndex!].label || ""
    if (label !== "") {
        label += ": "
    }
    label += roundNumberToMaxDP(Number(tooltipItem.yLabel!), decimalPoints)
    return label
}

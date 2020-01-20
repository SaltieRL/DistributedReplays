import {Card, CardContent, CardHeader, Typography} from "@material-ui/core"
import TrendingDown from "@material-ui/icons/TrendingDown"
import TrendingUp from "@material-ui/icons/TrendingUp"
import * as React from "react"
import {ItemFull, ItemUsage} from "../../Models/ItemStats"
import {roundNumberToMaxDP} from "../../Utils/String"

interface Props {
    item: ItemFull
    itemUsage: ItemUsage
}

export class ItemStatsUsers extends React.PureComponent<Props> {
    public render() {
        const {itemUsage} = this.props
        const dataPoint = itemUsage.data[itemUsage.data.length - 1]
        const previousDataPoint = itemUsage.data[itemUsage.data.length - 2]
        if (dataPoint === undefined) {
            return (
                <Card>
                    <CardHeader title={"Current users"} />
                    <CardContent style={{textAlign: "center"}}>
                        <Typography variant="h1">0%</Typography>
                        <Typography variant="subtitle1"> of players</Typography>
                    </CardContent>
                </Card>
            )
        }
        const percentage = (dataPoint.count / dataPoint.total) * 100
        let percentageString = percentage.toString()
        if (percentage > 1) {
            percentageString = roundNumberToMaxDP(percentage, 1)
        } else if (percentage > 0.1) {
            percentageString = roundNumberToMaxDP(percentage, 2)
        } else if (percentage > 0.01) {
            percentageString = roundNumberToMaxDP(percentage, 3)
        }
        let changeComponent
        let icon
        if (previousDataPoint !== undefined) {
            const previousPercentage = (previousDataPoint.count / previousDataPoint.total) * 100
            icon =
                percentage > previousPercentage ? (
                    <span style={{color: "#00d300"}}>
                        <TrendingUp fontSize={"large"} />
                    </span>
                ) : (
                    <span style={{color: "#d20000"}}>
                        <TrendingDown fontSize={"large"} />
                    </span>
                )

            const change = percentage - previousPercentage
            changeComponent =
                percentage > previousPercentage ? (
                    <Typography variant="h5" style={{color: "#00d300"}}>
                        +{roundNumberToMaxDP(change, 2)}%
                    </Typography>
                ) : (
                    <Typography variant="h5" style={{color: "#d20000"}}>
                        {roundNumberToMaxDP(change, 2)}%
                    </Typography>
                )
        }
        return (
            <Card>
                <CardHeader title={"Current users"} />
                <CardContent style={{textAlign: "center"}}>
                    <Typography variant="h1">
                        {icon}
                        {percentageString}%
                    </Typography>
                    <Typography variant="subtitle1"> of players</Typography>
                    {changeComponent}
                </CardContent>
            </Card>
        )
    }
}

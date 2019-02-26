import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import * as React from "react"
import { PlayStyleRawResponse } from "../../../../Models"
import { roundNumberToMaxDP } from "../../../../Utils/String"

interface StatRow {
    max: number
    min: number
    name: string
    values: number[]
}

interface Props {
    rawPlayers: PlayStyleRawResponse[]
    names: string[]
    heatmap?: boolean
}

interface State {

}

export class PlayerCompareTable extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props)
        // this.state = {currentSort: {statName: "hits", direction: "desc"}}
    }

    public render() {
        const {names, rawPlayers, heatmap} = this.props
        const header = (
            <TableRow>
                <TableCell>Stat</TableCell>
                {names.map((player, i) => <TableCell key={player}>{player}</TableCell>)}
            </TableRow>
        )

        if (rawPlayers.length > 0) {
            const categories = rawPlayers[0].dataPoints.map((point) => point.name)
            const stats: StatRow[] = categories.map((category, i) => {
                const values = rawPlayers.map((player) => player.dataPoints[i].average)
                return {
                    max: Math.max(...values),
                    min: Math.min(...values),
                    values,
                    name: category
                }
            })
            return (
                <Table>
                    <TableHead>
                        {header}
                    </TableHead>
                    <TableBody>

                        {stats.map((stat) => (<TableRow key={stat.name}>
                                    <TableCell>
                                        {stat.name}
                                    </TableCell>
                                    {stat.values.map((value, i) =>
                                        <TableCell key={i}
                                                   style={this.getTableCellStyles(value, stat,
                                                       (heatmap && rawPlayers.length > 1))}>
                                            {roundNumberToMaxDP(value)}
                                        </TableCell>)}
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            )
        }
        return null
    }

    private readonly getTableCellStyles = (value: number, stat: StatRow, isHeatmapMode?: boolean) => {
        return {
            backgroundColor: (isHeatmapMode ?
                `rgba(${200 * (value - stat.min) / (stat.max - stat.min)}, 0,
                                                            ${200 * (stat.max - value) / (stat.max - stat.min)}, 1)`
                :
                "#fff"),
            color: (isHeatmapMode ? "white" : "black")
        }
    }

}
